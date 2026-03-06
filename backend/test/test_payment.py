"""Tests for Payment endpoints: GET/POST /orders/{id}/payment."""
import pytest


class TestInitPayment:
    def test_init_payment_for_order(self, client, staff_headers, confirmed_order):
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["order_id"] == confirmed_order.id
        assert float(data["order_total"]) == float(confirmed_order.total_amount)
        assert float(data["paid_amount"]) == 0
        assert float(data["remaining_amount"]) == float(confirmed_order.total_amount)
        assert data["status"] == "pending"

    def test_init_payment_idempotent(self, client, staff_headers, confirmed_order):
        """Calling POST twice should return same payment."""
        resp1 = client.post(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        resp2 = client.post(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert resp1.status_code == 201
        assert resp2.status_code == 201
        assert resp1.json()["id"] == resp2.json()["id"]

    def test_init_payment_nonexistent_order(self, client, staff_headers):
        resp = client.post("/orders/99999/payment", headers=staff_headers)
        assert resp.status_code == 404

    def test_init_payment_cancelled_order(self, client, db, staff_headers, sample_order):
        from src.core.enums import OrderStatus
        sample_order.status = OrderStatus.cancelled
        db.commit()

        resp = client.post(
            f"/orders/{sample_order.id}/payment",
            headers=staff_headers
        )
        assert resp.status_code == 400

    def test_unauthenticated_cannot_init_payment(self, client, confirmed_order):
        resp = client.post(f"/orders/{confirmed_order.id}/payment")
        assert resp.status_code == 401


class TestGetPayment:
    def test_get_payment_success(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.get(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["order_id"] == confirmed_order.id
        assert data["status"] == "pending"

    def test_get_payment_no_payment_yet(self, client, staff_headers, sample_order):
        """Order without payment should return 404."""
        resp = client.get(
            f"/orders/{sample_order.id}/payment",
            headers=staff_headers
        )
        assert resp.status_code == 404

    def test_get_payment_nonexistent_order(self, client, staff_headers):
        resp = client.get("/orders/99999/payment", headers=staff_headers)
        assert resp.status_code == 404

    def test_get_payment_includes_transactions(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.get(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "transactions" in data
        assert isinstance(data["transactions"], list)
