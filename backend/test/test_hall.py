"""Tests for Hall CRUD endpoints."""
import pytest


class TestCreateHall:
    def test_create_hall_success(self, client, owner_headers):
        resp = client.post("/hall/", json={
            "name": "Crystal Hall",
            "location": "Floor 2",
            "capacity": 300,
            "min_tables": 10,
            "max_tables": 60,
            "price_per_table": 600000.00,
            "is_available": True,
            "description": "Luxury crystal hall",
        }, headers=owner_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Crystal Hall"
        assert data["capacity"] == 300

    def test_staff_cannot_create_hall(self, client, staff_headers):
        resp = client.post("/hall/", json={
            "name": "Unauthorized Hall",
            "location": "Floor 3",
            "capacity": 100,
            "min_tables": 5,
            "max_tables": 20,
            "price_per_table": 500000.00,
        }, headers=staff_headers)
        assert resp.status_code == 403

    def test_create_hall_max_less_than_min(self, client, owner_headers):
        resp = client.post("/hall/", json={
            "name": "Bad Hall",
            "location": "Floor 1",
            "capacity": 100,
            "min_tables": 20,
            "max_tables": 5,
            "price_per_table": 500000.00,
        }, headers=owner_headers)
        assert resp.status_code == 422

    def test_create_hall_duplicate_name(self, client, owner_headers, sample_hall):
        resp = client.post("/hall/", json={
            "name": sample_hall.name,
            "location": "Somewhere",
            "capacity": 100,
            "min_tables": 5,
            "max_tables": 20,
            "price_per_table": 500000.00,
        }, headers=owner_headers)
        assert resp.status_code in (400, 409, 500)


class TestGetHall:
    def test_list_halls(self, client, sample_hall):
        resp = client.get("/hall/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1

    def test_get_hall_by_id(self, client, sample_hall):
        resp = client.get(f"/hall/{sample_hall.id}")
        assert resp.status_code == 200
        assert resp.json()["name"] == sample_hall.name

    def test_get_nonexistent_hall(self, client):
        resp = client.get("/hall/99999")
        assert resp.status_code == 404


class TestUpdateHall:
    def test_owner_can_update_hall(self, client, owner_headers, sample_hall):
        resp = client.put(f"/hall/{sample_hall.id}", json={
            "name": "Updated Hall",
            "location": "Floor 1",
            "capacity": 200,
            "min_tables": 5,
            "max_tables": 50,
            "price_per_table": 550000.00,
        }, headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["name"] == "Updated Hall"


class TestToggleAvailability:
    def test_toggle_hall_availability(self, client, owner_headers, sample_hall):
        resp = client.patch(f"/hall/{sample_hall.id}/availability", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_available"] != sample_hall.is_available


class TestDeleteHall:
    def test_owner_can_delete_hall(self, client, owner_headers, sample_hall):
        resp = client.delete(f"/hall/{sample_hall.id}", headers=owner_headers)
        assert resp.status_code == 204
