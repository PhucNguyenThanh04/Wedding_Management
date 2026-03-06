"""Tests for Staff CRUD endpoints."""
import pytest
from test.conftest import _create_staff, _auth_header
from src.core.enums import StaffRole


class TestCreateStaff:
    def test_owner_can_create_staff(self, client, owner_headers):
        resp = client.post("/staff/", json={
            "username": "newstaff",
            "email": "newstaff@test.com",
            "full_name": "New Staff",
            "password": "Password123",
            "role": "staff",
            "phone": "0912345679",
        }, headers=owner_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["username"] == "newstaff"
        assert data["role"] == "staff"

    def test_staff_cannot_create_staff(self, client, staff_headers):
        resp = client.post("/staff/", json={
            "username": "hacker",
            "email": "hacker@test.com",
            "full_name": "Hacker",
            "password": "Password123",
        }, headers=staff_headers)
        assert resp.status_code == 403

    def test_create_staff_duplicate_username(self, client, owner, owner_headers):
        resp = client.post("/staff/", json={
            "username": owner.username,
            "email": "other@test.com",
            "full_name": "Dup",
            "password": "Password123",
        }, headers=owner_headers)
        assert resp.status_code in (400, 409)

    def test_create_staff_weak_password(self, client, owner_headers):
        resp = client.post("/staff/", json={
            "username": "weakpw",
            "email": "weakpw@test.com",
            "full_name": "Weak PW",
            "password": "123",
        }, headers=owner_headers)
        assert resp.status_code == 422


class TestGetStaff:
    def test_list_staff(self, client, owner, owner_headers):
        resp = client.get("/staff/", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_get_staff_by_id(self, client, owner, owner_headers):
        resp = client.get(f"/staff/{owner.id}", headers=owner_headers)
        assert resp.status_code == 200
        assert resp.json()["username"] == owner.username

    def test_get_nonexistent_staff(self, client, owner_headers):
        from uuid import uuid4
        resp = client.get(f"/staff/{uuid4()}", headers=owner_headers)
        assert resp.status_code == 404

    def test_staff_cannot_list_staff(self, client, staff_headers):
        resp = client.get("/staff/", headers=staff_headers)
        assert resp.status_code == 403

    def test_unauthenticated_cannot_list_staff(self, client):
        resp = client.get("/staff/")
        assert resp.status_code == 401
