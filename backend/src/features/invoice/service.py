import os
import logging
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.features.invoice.model import Invoice
from src.features.invoice.schemas import InvoiceCreate
from src.features.order.model import Order
from src.features.payment.model import Payment
from src.features.customer.model import Customer
from src.features.hall.model import Hall
from src.core.enums import OrderStatus

logger = logging.getLogger(__name__)

# Đường dẫn tuyệt đối: backend/uploads/invoices/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INVOICES_DIR = os.path.join(BASE_DIR, "uploads", "invoices")


def _ensure_invoices_dir():
    os.makedirs(INVOICES_DIR, exist_ok=True)


def _generate_invoice_no(db: Session) -> str:
    today = datetime.now().strftime("%Y%m%d")
    prefix = f"INV-{today}-"

    last_invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_no.like(f"{prefix}%"))
        .order_by(Invoice.id.desc())
        .first()
    )

    if last_invoice:
        last_num = int(last_invoice.invoice_no.split("-")[-1])
        next_num = last_num + 1
    else:
        next_num = 1

    return f"{prefix}{next_num:04d}"


def _generate_pdf(
    invoice: Invoice,
    order: Order,
    payment: Payment,
    customer,
    hall,
    issued_at: datetime,
) -> str:
    """Tạo PDF hóa đơn sử dụng reportlab.

    ``issued_at`` được truyền tường minh vì tại thời điểm gọi hàm này
    giá trị ``invoice.issued_at`` có thể chưa được DB gán (server-default).
    """
    _ensure_invoices_dir()

    filename = f"{invoice.invoice_no}.pdf"
    filepath = os.path.join(INVOICES_DIR, filename)

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        logger.error("reportlab chưa được cài đặt. Chạy: pip install reportlab")
        raise RuntimeError(
            "Thư viện reportlab chưa được cài đặt. "
            "Hãy chạy: pip install reportlab"
        ) from exc

    try:
        c = canvas.Canvas(filepath, pagesize=A4)
        width, height = A4

        # ── Header ──────────────────────────────────────
        c.setFont("Helvetica-Bold", 20)
        c.drawString(30 * mm, height - 30 * mm, "HOA DON / INVOICE")

        c.setFont("Helvetica", 10)
        c.drawString(30 * mm, height - 40 * mm, f"Ma hoa don: {invoice.invoice_no}")
        c.drawString(
            30 * mm,
            height - 45 * mm,
            f"Ngay xuat: {issued_at.strftime('%d/%m/%Y %H:%M')}",
        )

        # ── Customer Info ───────────────────────────────
        y = height - 60 * mm
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30 * mm, y, "THONG TIN KHACH HANG")
        c.setFont("Helvetica", 10)
        y -= 7 * mm
        c.drawString(30 * mm, y, f"Ten: {customer.full_name if customer else 'N/A'}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"SDT: {customer.phone if customer else 'N/A'}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Email: {customer.email if customer else 'N/A'}")

        # ── Order Info ──────────────────────────────────
        y -= 12 * mm
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30 * mm, y, "THONG TIN DON HANG")
        c.setFont("Helvetica", 10)
        y -= 7 * mm
        c.drawString(30 * mm, y, f"Ma don: #{order.id}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Sanh: {hall.name if hall else 'N/A'}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Ngay to chuc: {order.event_date}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Ca: {order.event_shift.value}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Loai su kien: {order.event_type.value}")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"So ban: {order.so_ban}")

        # ── Pricing ─────────────────────────────────────
        y -= 12 * mm
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30 * mm, y, "CHI TIET THANH TOAN")
        c.setFont("Helvetica", 10)
        y -= 7 * mm

        items = [
            ("Tien menu:", f"{order.menu_total:,.0f} VND"),
            ("Mon them:", f"{order.extra_dishes_total:,.0f} VND"),
            ("Tien ban:", f"{order.table_total:,.0f} VND"),
            ("Phi dich vu:", f"{order.service_fee or 0:,.0f} VND"),
            ("Giam gia:", f"-{order.discount_amount or 0:,.0f} VND"),
            ("Tam tinh:", f"{order.subtotal:,.0f} VND"),
            (f"Thue ({order.tax_rate}%):", f"{order.tax_amount:,.0f} VND"),
        ]

        for label, value in items:
            c.drawString(30 * mm, y, label)
            c.drawRightString(width - 30 * mm, y, value)
            y -= 5 * mm

        # ── Total ───────────────────────────────────────
        y -= 3 * mm
        c.setFont("Helvetica-Bold", 14)
        c.drawString(30 * mm, y, "TONG CONG:")
        c.drawRightString(width - 30 * mm, y, f"{order.total_amount:,.0f} VND")

        # ── Payment info ────────────────────────────────
        y -= 10 * mm
        c.setFont("Helvetica", 10)
        c.drawString(30 * mm, y, f"Da thanh toan: {payment.paid_amount:,.0f} VND")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Con lai: {payment.remaining_amount:,.0f} VND")
        y -= 5 * mm
        c.drawString(30 * mm, y, f"Trang thai: {payment.status.value}")

        # ── Notes ───────────────────────────────────────
        if invoice.notes:
            y -= 12 * mm
            c.setFont("Helvetica-Bold", 10)
            c.drawString(30 * mm, y, "Ghi chu:")
            c.setFont("Helvetica", 10)
            y -= 5 * mm
            c.drawString(30 * mm, y, invoice.notes)

        # ── Footer ──────────────────────────────────────
        c.setFont("Helvetica", 8)
        c.drawString(30 * mm, 20 * mm, "Cam on quy khach! / Thank you!")

        c.save()
        logger.info("PDF hóa đơn đã tạo thành công: %s", filepath)
        return filepath

    except Exception as e:
        logger.error("Lỗi khi tạo PDF hóa đơn: %s", e, exc_info=True)
        # Xóa file lỗi nếu có
        if os.path.exists(filepath):
            os.remove(filepath)
        raise RuntimeError(f"Không thể tạo PDF hóa đơn: {e}") from e


async def create_invoice_for_order(
    db: Session,
    order_id: int,
    payload: InvoiceCreate,
    current_staff
) -> Invoice:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        # Chỉ cho xuất hóa đơn khi đơn đã completed hoặc in_progress
        if order.status not in [OrderStatus.completed, OrderStatus.in_progress, OrderStatus.confirmed]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Không thể xuất hóa đơn cho đơn hàng có trạng thái '{order.status.value}'. "
                       f"Đơn phải ở trạng thái confirmed/in_progress/completed."
            )

        payment = db.query(Payment).filter(Payment.order_id == order_id).first()
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng chưa có thông tin thanh toán. Hãy khởi tạo payment trước."
            )

        # Gán issued_at tường minh bằng Python datetime (không dùng func.now() SQL)
        # để _generate_pdf có giá trị ngay trước khi commit.
        now = datetime.now()

        # Tạo mã hóa đơn
        invoice_no = _generate_invoice_no(db)

        invoice = Invoice(
            order_id=order_id,
            payment_id=payment.id,
            invoice_no=invoice_no,
            issued_at=now,
            tax_amount=order.tax_amount,
            notes=payload.notes,
            created_by_staff_id=current_staff.id,
            created_at=now,
        )
        db.add(invoice)
        db.flush()
        db.refresh(invoice)

        # Tạo PDF
        customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
        hall = db.query(Hall).filter(Hall.id == order.hall_id).first()
        pdf_path = _generate_pdf(invoice, order, payment, customer, hall, issued_at=now)
        invoice.pdf_path = pdf_path

        # Cập nhật trạng thái đơn → invoiced
        order.status = OrderStatus.invoiced

        db.commit()
        db.refresh(invoice)
        logger.info(
            "Hóa đơn %s đã tạo cho đơn hàng #%s — PDF: %s",
            invoice.invoice_no, order_id, pdf_path,
        )
        return invoice

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Lỗi khi tạo hóa đơn cho đơn #%s: %s", order_id, e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo hóa đơn: {str(e)}"
        )


async def get_invoice_by_order(db: Session, order_id: int) -> Invoice:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        invoice = db.query(Invoice).filter(
            Invoice.order_id == order_id
        ).order_by(Invoice.id.desc()).first()

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Đơn hàng #{order_id} chưa có hóa đơn."
            )
        return invoice

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất hóa đơn: {str(e)}"
        )


async def list_invoices(db: Session) -> list[Invoice]:
    """Danh sách tất cả hóa đơn"""
    try:
        return db.query(Invoice).order_by(Invoice.id.desc()).all()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất danh sách hóa đơn: {str(e)}"
        )


async def get_invoice_by_id(db: Session, invoice_id: int) -> Invoice:
    """Lấy hóa đơn theo ID"""
    try:
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy hóa đơn với ID {invoice_id}."
            )
        return invoice

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất hóa đơn: {str(e)}"
        )


async def get_invoice_pdf_path(db: Session, invoice_id: int) -> str:
    """Lấy đường dẫn PDF của hóa đơn"""
    try:
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy hóa đơn với ID {invoice_id}."
            )

        if not invoice.pdf_path or not os.path.exists(invoice.pdf_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File PDF hóa đơn không tồn tại. Hãy xuất lại hóa đơn."
            )
        return invoice.pdf_path

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tải PDF: {str(e)}"
        )
