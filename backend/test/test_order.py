"""Tests for Order endpoints: create, update, status transitions, menus, dishes."""
import pytest
from datetime import date, time


class TestCreateOrder:
    def test_create_order_success(self, client, staff_headers, sample_customer, sample_hall):
        resp = client.post("/orders/", json={
            "customer_id": sample_customer.id,
            "hall_id": sample_hall.id,
            "event_date": "2026-07-20",
            "event_shift": "EVENING",
            "event_time": "18:00",
            "event_type": "wedding",
            "so_ban": 20,
            "notes": "Test wedding order",
        }, headers=staff_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["customer_id"] == sample_customer.id
        assert data["hall_id"] == sample_hall.id
        assert data["status"] == "booking_pending"
        assert data["so_ban"] == 20

    def test_create_order_past_date(self, client, staff_headers, sample_customer, sample_hall):
        resp = client.post("/orders/", json={
            "customer_id": sample_customer.id,
            "hall_id": sample_hall.id,
            "event_date": "2020-01-01",
            "event_shift": "MORNING",
            "event_time": "09:00",
            "event_type": "wedding",
            "so_ban": 10,
        }, headers=staff_headers)
        assert resp.status_code == 422

    def test_create_order_invalid_customer(self, client, staff_headers, sample_hall):
        resp = client.post("/orders/", json={
            "customer_id": 99999,
            "hall_id": sample_hall.id,
            "event_date": "2026-08-01",
            "event_shift": "MORNING",
            "event_time": "09:00",
            "event_type": "wedding",
            "so_ban": 10,
        }, headers=staff_headers)
        assert resp.status_code == 404

    def test_create_order_too_many_tables(self, client, staff_headers, sample_customer, sample_hall):
        resp = client.post("/orders/", json={
            "customer_id": sample_customer.id,
            "hall_id": sample_hall.id,
            "event_date": "2026-09-01",
            "event_shift": "EVENING",
            "event_time": "18:00",
            "event_type": "birthday",
            "so_ban": 999,
        }, headers=staff_headers)
        assert resp.status_code in (400, 422)

    def test_create_order_duplicate_slot(self, client, staff_headers, sample_customer, sample_hall):
        # First order
        payload = {
            "customer_id": sample_customer.id,
            "hall_id": sample_hall.id,
            "event_date": "2026-10-01",
            "event_shift": "MORNING",
            "event_time": "09:00",
            "event_type": "wedding",
            "so_ban": 10,
        }
        resp1 = client.post("/orders/", json=payload, headers=staff_headers)
        assert resp1.status_code == 201

        # Duplicate slot
        resp2 = client.post("/orders/", json=payload, headers=staff_headers)
        assert resp2.status_code == 409

    def test_owner_cannot_create_order(self, client, owner_headers, sample_customer, sample_hall):
        resp = client.post("/orders/", json={
            "customer_id": sample_customer.id,
            "hall_id": sample_hall.id,
            "event_date": "2026-11-01",
            "event_shift": "LUNCH",
            "event_time": "11:30",
            "event_type": "corporate",
            "so_ban": 15,
        }, headers=owner_headers)
        assert resp.status_code == 403


class TestGetOrders:
    def test_list_orders(self, client, owner_headers, sample_order):
        resp = client.get("/orders/", headers=owner_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
        assert len(resp.json()) >= 1

    def test_get_order_by_id(self, client, staff_headers, sample_order):
        resp = client.get(f"/orders/{sample_order.id}", headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == sample_order.id

    def test_get_nonexistent_order(self, client, staff_headers):
        resp = client.get("/orders/99999", headers=staff_headers)
        assert resp.status_code == 404


class TestOrderStatusTransitions:
    def test_confirm_order(self, client, owner_headers, sample_order):
        resp = client.post(f"/orders/{sample_order.id}/confirm", headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "confirmed"

    def test_in_process_order(self, client, owner_headers, confirmed_order):
        resp = client.post(f"/orders/{confirmed_order.id}/in_process", headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "in_progress"

    def test_complete_order(self, client, owner_headers, confirmed_order):
        resp = client.post(f"/orders/{confirmed_order.id}/completed", headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "completed"

    def test_cancel_order(self, client, owner_headers, sample_order):
        resp = client.delete(f"/orders/{sample_order.id}", headers=owner_headers)
        assert resp.status_code == 204


class TestOrderMenus:
    def test_add_menu_to_order(self, client, staff_headers, sample_order, sample_menu):
        resp = client.post(f"/orders/{sample_order.id}/menus", json={
            "menu_id": sample_menu.id,
            "quantity": 2,
            "notes": "Extra spicy",
        }, headers=staff_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["order_menus"]) == 1
        assert data["order_menus"][0]["menu_id"] == sample_menu.id

    def test_add_duplicate_menu(self, client, staff_headers, sample_order, sample_menu):
        # Add first
        client.post(f"/orders/{sample_order.id}/menus", json={
            "menu_id": sample_menu.id,
            "quantity": 1,
        }, headers=staff_headers)

        # Add duplicate
        resp = client.post(f"/orders/{sample_order.id}/menus", json={
            "menu_id": sample_menu.id,
            "quantity": 1,
        }, headers=staff_headers)
        assert resp.status_code == 409

    def test_add_menu_nonexistent_order(self, client, staff_headers, sample_menu):
        resp = client.post("/orders/99999/menus", json={
            "menu_id": sample_menu.id,
            "quantity": 1,
        }, headers=staff_headers)
        assert resp.status_code == 404


class TestUpdateOrder:
    def test_update_order(self, client, staff_headers, sample_order, sample_hall):
        resp = client.put(f"/orders/{sample_order.id}", json={
            "hall_id": sample_hall.id,
            "event_date": "2026-07-25",
            "event_shift": "LUNCH",
            "event_time": "11:30",
            "event_type": "birthday",
            "so_ban": 15,
            "notes": "Updated notes",
        }, headers=staff_headers)
        assert resp.status_code == 200
        assert resp.json()["so_ban"] == 15
