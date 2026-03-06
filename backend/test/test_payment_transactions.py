"""Tests for Payment Transaction endpoints:
GET/POST /orders/{id}/payment/transactions
"""
import pytest
from decimal import Decimal


class TestRecordTransaction:
    def test_record_deposit(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={
                "amount": 3000000,
                "payment_method": "cash",
                "note": "Đặt cọc lần 1",
            },
            headers=staff_headers
        )
        assert resp.status_code == 201
        data = resp.json()
        assert float(data["amount"]) == 3000000
        assert data["payment_method"] == "cash"

        # Check payment updated
        pay_resp = client.get(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        pay_data = pay_resp.json()
        assert pay_data["status"] == "deposit_paid"
        assert float(pay_data["paid_amount"]) == 3000000

    def test_record_partial_payment(self, client, staff_headers, confirmed_order, sample_payment):
        """After deposit, second payment should move to partial_paid."""
        # First payment (deposit)
        client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 2000000, "payment_method": "cash"},
            headers=staff_headers
        )

        # Second payment (partial)
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 3000000, "payment_method": "bank_transfer",
                  "bank_name": "Vietcombank", "transaction_ref": "VCB123"},
            headers=staff_headers
        )
        assert resp.status_code == 201

        pay_resp = client.get(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert pay_resp.json()["status"] == "partial_paid"
        assert float(pay_resp.json()["paid_amount"]) == 5000000

    def test_record_full_payment(self, client, staff_headers, confirmed_order, sample_payment):
        """Pay full amount → fully_paid."""
        total = float(confirmed_order.total_amount)
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": total, "payment_method": "card"},
            headers=staff_headers
        )
        assert resp.status_code == 201

        pay_resp = client.get(
            f"/orders/{confirmed_order.id}/payment",
            headers=staff_headers
        )
        assert pay_resp.json()["status"] == "fully_paid"
        assert float(pay_resp.json()["remaining_amount"]) == 0

    def test_record_overpayment(self, client, staff_headers, confirmed_order, sample_payment):
        """Cannot pay more than remaining."""
        total = float(confirmed_order.total_amount)
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": total + 1000000, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 400

    def test_record_transaction_no_payment(self, client, staff_headers, sample_order):
        """Order without payment should fail."""
        resp = client.post(
            f"/orders/{sample_order.id}/payment/transactions",
            json={"amount": 1000000, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 404

    def test_record_transaction_nonexistent_order(self, client, staff_headers):
        resp = client.post(
            "/orders/99999/payment/transactions",
            json={"amount": 1000000, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 404

    def test_record_transaction_zero_amount(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 0, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 422

    def test_record_transaction_negative_amount(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": -100000, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 422

    def test_unauthenticated_cannot_record_transaction(self, client, confirmed_order):
        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 1000000, "payment_method": "cash"},
        )
        assert resp.status_code == 401

    def test_cannot_pay_after_fully_paid(self, client, staff_headers, confirmed_order, sample_payment):
        """After fully_paid, no more transactions allowed."""
        total = float(confirmed_order.total_amount)
        client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": total, "payment_method": "cash"},
            headers=staff_headers
        )

        resp = client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 1000, "payment_method": "cash"},
            headers=staff_headers
        )
        assert resp.status_code == 400


class TestListTransactions:
    def test_list_transactions_empty(self, client, staff_headers, confirmed_order, sample_payment):
        resp = client.get(
            f"/orders/{confirmed_order.id}/payment/transactions",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 0
        assert data["items"] == []

    def test_list_transactions_after_payments(self, client, staff_headers, confirmed_order, sample_payment):
        # Make 2 payments
        client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 1000000, "payment_method": "cash"},
            headers=staff_headers
        )
        client.post(
            f"/orders/{confirmed_order.id}/payment/transactions",
            json={"amount": 2000000, "payment_method": "bank_transfer", "bank_name": "ACB"},
            headers=staff_headers
        )

        resp = client.get(
            f"/orders/{confirmed_order.id}/payment/transactions",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_list_transactions_nonexistent_order(self, client, staff_headers):
        resp = client.get("/orders/99999/payment/transactions", headers=staff_headers)
        assert resp.status_code == 404
