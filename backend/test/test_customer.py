"""Tests for Customer CRUD endpoints."""
import pytest


class TestCreateCustomer:
    def test_create_customer_success(self, client, staff_headers):
        resp = client.post("/customer/", json={
            "full_name": "Tran Thi B",
            "phone": "0987654321",
            "email": "ttb@test.com",
            "address": "123 Nguyen Hue",
        }, headers=staff_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["full_name"] == "Tran Thi B"
        assert data["phone"] == "0987654321"

    def test_create_customer_invalid_phone(self, client, staff_headers):
        resp = client.post("/customer/", json={
            "full_name": "Bad Phone",
            "phone": "12345",
        }, headers=staff_headers)
        assert resp.status_code == 422

    def test_create_customer_missing_name(self, client, staff_headers):
        resp = client.post("/customer/", json={
            "phone": "0912345678",
        }, headers=staff_headers)
        assert resp.status_code == 422

    def test_create_customer_duplicate_phone(self, client, staff_headers, sample_customer):
        resp = client.post("/customer/", json={
            "full_name": "Duplicate",
            "phone": sample_customer.phone,
        }, headers=staff_headers)
        assert resp.status_code in (400, 409, 500)

    def test_unauthenticated_cannot_create(self, client):
        resp = client.post("/customer/", json={
            "full_name": "No Auth",
            "phone": "0912345671",
        })
        assert resp.status_code == 401


class TestGetCustomer:
    def test_list_customers(self, client, staff_headers, sample_customer):
        resp = client.get("/customer/", headers=staff_headers)
        assert resp.status_code == 200

    def test_get_customer_by_id(self, client, staff_headers, sample_customer):
        resp = client.get(f"/customer/{sample_customer.id}", headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["full_name"] == sample_customer.full_name

    def test_get_nonexistent_customer(self, client, staff_headers):
        resp = client.get("/customer/99999", headers=staff_headers)
        assert resp.status_code == 404

    def test_get_customer_by_phone(self, client, staff_headers, sample_customer):
        resp = client.get(f"/customer/phone/{sample_customer.phone}", headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["phone"] == sample_customer.phone

    def test_get_customer_orders(self, client, staff_headers, sample_customer, sample_order):
        resp = client.get(f"/customer/{sample_customer.id}/orders", headers=staff_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= 1


class TestUpdateCustomer:
    def test_update_customer(self, client, staff_headers, sample_customer):
        resp = client.put(f"/customer/{sample_customer.id}", json={
            "full_name": "Updated Name",
        }, headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Updated Name"

    def test_update_nonexistent_customer(self, client, staff_headers):
        resp = client.put("/customer/99999", json={
            "full_name": "Ghost",
        }, headers=staff_headers)
        assert resp.status_code == 404
