"""Tests for Dishes CRUD endpoints."""
import pytest


class TestCreateDish:
    def test_create_dish_success(self, client, owner_headers):
        resp = client.post("/dishes/", json={
            "name": "Pho Bo",
            "description": "Vietnamese beef noodle soup",
            "dish_type": "soup",
            "price": 120000.00,
            "is_available": True,
        }, headers=owner_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Pho Bo"
        assert data["dish_type"] == "soup"

    def test_create_dish_invalid_type(self, client, owner_headers):
        resp = client.post("/dishes/", json={
            "name": "Bad Dish",
            "dish_type": "invalid_type",
            "price": 100000,
        }, headers=owner_headers)
        assert resp.status_code == 422

    def test_create_dish_negative_price(self, client, owner_headers):
        resp = client.post("/dishes/", json={
            "name": "Free Dish",
            "dish_type": "appetizer",
            "price": -10000,
        }, headers=owner_headers)
        assert resp.status_code == 422

    def test_staff_cannot_create_dish(self, client, staff_headers):
        resp = client.post("/dishes/", json={
            "name": "Staff Dish",
            "dish_type": "appetizer",
            "price": 100000,
        }, headers=staff_headers)
        assert resp.status_code == 403


class TestGetDishes:
    def test_list_dishes(self, client, sample_dish):
        resp = client.get("/dishes/")
        assert resp.status_code == 200

    def test_list_dishes_by_type(self, client, sample_dish):
        resp = client.get("/dishes/?dish_type=main_course")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert all(d["dish_type"] == "main_course" for d in data)

    def test_get_dish_by_id(self, client, sample_dish):
        resp = client.get(f"/dishes/{sample_dish.id}")
        assert resp.status_code == 200
        assert resp.json()["name"] == sample_dish.name

    def test_get_nonexistent_dish(self, client):
        resp = client.get("/dishes/99999")
        assert resp.status_code == 404


class TestUpdateDish:
    def test_update_dish(self, client, owner_headers, sample_dish):
        resp = client.put(f"/dishes/{sample_dish.id}", json={
            "name": "Updated Lobster",
            "price": 400000,
        }, headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["name"] == "Updated Lobster"


class TestDeleteDish:
    def test_delete_dish(self, client, owner_headers, sample_dish):
        resp = client.delete(f"/dishes/{sample_dish.id}", headers=owner_headers)
        assert resp.status_code in (200, 204)
