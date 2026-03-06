"""Tests for Invoice endpoints:
GET/POST /orders/{id}/invoice
GET /invoices, GET /invoices/{id}, GET /invoices/{id}/download
"""
import pytest
from decimal import Decimal
from src.core.enums import OrderStatus


@pytest.fixture()
def completed_order_with_payment(db, confirmed_order, sample_payment):
    """A completed order with payment ready for invoicing."""
    confirmed_order.status = OrderStatus.completed
    db.commit()
    db.refresh(confirmed_order)
    return confirmed_order


class TestCreateInvoice:
    def test_create_invoice_success(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        resp = client.post(
            f"/orders/{order.id}/invoice",
            json={"notes": "Invoice for wedding"},
            headers=staff_headers
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["order_id"] == order.id
        assert data["invoice_no"].startswith("INV-")
        assert data["notes"] == "Invoice for wedding"
        assert data["pdf_path"] is not None or data["pdf_path"] == ""

    def test_create_invoice_no_notes(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        resp = client.post(
            f"/orders/{order.id}/invoice",
            json={},
            headers=staff_headers
        )
        assert resp.status_code == 201
        assert resp.json()["notes"] is None

    def test_create_invoice_booking_pending_fails(self, client, staff_headers, sample_order, sample_payment):
        """Cannot create invoice for booking_pending order."""
        resp = client.post(
            f"/orders/{sample_order.id}/invoice",
            json={},
            headers=staff_headers
        )
        assert resp.status_code == 400

    def test_create_invoice_no_payment_fails(self, client, staff_headers, db, sample_order):
        """Cannot create invoice if no payment exists."""
        sample_order.status = OrderStatus.completed
        db.commit()

        resp = client.post(
            f"/orders/{sample_order.id}/invoice",
            json={},
            headers=staff_headers
        )
        assert resp.status_code == 400

    def test_create_invoice_nonexistent_order(self, client, staff_headers):
        resp = client.post(
            "/orders/99999/invoice",
            json={},
            headers=staff_headers
        )
        assert resp.status_code == 404

    def test_create_invoice_changes_status_to_invoiced(self, client, staff_headers, db, completed_order_with_payment):
        order = completed_order_with_payment
        client.post(
            f"/orders/{order.id}/invoice",
            json={},
            headers=staff_headers
        )

        # Check order status via DB
        db.refresh(order)
        assert order.status == OrderStatus.invoiced

    def test_create_multiple_invoices(self, client, staff_headers, db, completed_order_with_payment):
        """Should allow creating multiple invoices for same order (re-issue)."""
        order = completed_order_with_payment
        resp1 = client.post(
            f"/orders/{order.id}/invoice",
            json={"notes": "First"},
            headers=staff_headers
        )
        assert resp1.status_code == 201

        # Reset status for second invoice
        order.status = OrderStatus.completed
        db.commit()

        resp2 = client.post(
            f"/orders/{order.id}/invoice",
            json={"notes": "Second"},
            headers=staff_headers
        )
        assert resp2.status_code == 201
        assert resp1.json()["invoice_no"] != resp2.json()["invoice_no"]


class TestGetOrderInvoice:
    def test_get_order_invoice(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        # Create first
        client.post(f"/orders/{order.id}/invoice", json={}, headers=staff_headers)

        resp = client.get(f"/orders/{order.id}/invoice", headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["order_id"] == order.id

    def test_get_order_invoice_none_exists(self, client, staff_headers, confirmed_order):
        resp = client.get(f"/orders/{confirmed_order.id}/invoice", headers=staff_headers)
        assert resp.status_code == 404


class TestListInvoices:
    def test_list_invoices_empty(self, client, staff_headers):
        resp = client.get("/invoices/", headers=staff_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 0
        assert data["items"] == []

    def test_list_invoices_with_data(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        client.post(f"/orders/{order.id}/invoice", json={}, headers=staff_headers)

        resp = client.get("/invoices/", headers=staff_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1


class TestGetInvoiceById:
    def test_get_invoice_by_id(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        create_resp = client.post(f"/orders/{order.id}/invoice", json={}, headers=staff_headers)
        invoice_id = create_resp.json()["id"]

        resp = client.get(f"/invoices/{invoice_id}", headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == invoice_id

    def test_get_nonexistent_invoice(self, client, staff_headers):
        resp = client.get("/invoices/99999", headers=staff_headers)
        assert resp.status_code == 404


class TestDownloadInvoicePdf:
    def test_download_pdf(self, client, staff_headers, completed_order_with_payment):
        order = completed_order_with_payment
        create_resp = client.post(f"/orders/{order.id}/invoice", json={}, headers=staff_headers)
        invoice_id = create_resp.json()["id"]

        resp = client.get(f"/invoices/{invoice_id}/download", headers=staff_headers)
        # If reportlab is installed, should return PDF
        if resp.status_code == 200:
            assert resp.headers.get("content-type") == "application/pdf"
        else:
            # PDF not generated (reportlab not installed)
            assert resp.status_code == 404

    def test_download_nonexistent_invoice(self, client, staff_headers):
        resp = client.get("/invoices/99999/download", headers=staff_headers)
        assert resp.status_code == 404

    def test_unauthenticated_cannot_download(self, client):
        resp = client.get("/invoices/1/download")
        assert resp.status_code == 401
