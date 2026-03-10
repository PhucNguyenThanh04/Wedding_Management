from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.enums import StaffRole
from src.core.security import require_roles
from src.features.invoice import service, schemas
from src.features.staff.model import Staff


order_invoice_router = APIRouter(
    prefix="/orders",
    tags=["Invoices"]
)

# Router cho /invoices
invoice_router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)



@order_invoice_router.get("/{order_id}/invoice", response_model=schemas.InvoiceResponse)
async def get_order_invoice(
    order_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):
    return await service.get_invoice_by_order(db, order_id)


@order_invoice_router.post(
    "/{order_id}/invoice",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.InvoiceResponse
)
async def create_order_invoice(
    order_id: int,
    payload: schemas.InvoiceCreate,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):
    return await service.create_invoice_for_order(db, order_id, payload, _current_staff)



@invoice_router.get("/", response_model=schemas.InvoiceListResponse)
async def list_all_invoices(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):
    """Danh sách tất cả hóa đơn"""
    invoices = await service.list_invoices(db)
    return {
        "total": len(invoices),
        "items": invoices
    }


@invoice_router.get("/{invoice_id}", response_model=schemas.InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):

    return await service.get_invoice_by_id(db, invoice_id)


@invoice_router.get("/{invoice_id}/download")
async def download_invoice_pdf(
    invoice_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):

    pdf_path = await service.get_invoice_pdf_path(db, invoice_id)
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"invoice_{invoice_id}.pdf"
    )
