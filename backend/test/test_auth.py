"""Tests for Auth endpoints: login, refresh, logout, me."""
import pytest


class TestLogin:
    def test_login_success(self, client, owner):
        resp = client.post("/auth/login", data={
            "username": owner.username,
            "password": "Test1234",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, owner):
        resp = client.post("/auth/login", data={
            "username": owner.username,
            "password": "WrongPassword",
        })
        assert resp.status_code in (401, 400)

    def test_login_nonexistent_user(self, client):
        resp = client.post("/auth/login", data={
            "username": "nobody",
            "password": "Test1234",
        })
        assert resp.status_code in (401, 400)


class TestMe:
    def test_me_authenticated(self, client, owner, owner_headers):
        resp = client.get("/auth/me", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["username"] == owner.username
        assert data["email"] == owner.email

    def test_me_unauthenticated(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code == 401


class TestRefreshToken:
    def test_refresh_token_flow(self, client, owner):
        # Login first
        login_resp = client.post("/auth/login", data={
            "username": owner.username,
            "password": "Test1234",
        })
        assert login_resp.status_code == 200
        refresh_token = login_resp.json()["refresh_token"]

        # Refresh
        resp = client.post("/auth/refresh", json=refresh_token)
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_refresh_with_invalid_token(self, client):
        resp = client.post("/auth/refresh", json="invalid_token_here")
        assert resp.status_code in (401, 400)


class TestLogout:
    def test_logout_authenticated(self, client, owner, owner_headers):
        resp = client.post("/auth/logout", headers=owner_headers)
        assert resp.status_code == 200

    def test_logout_unauthenticated(self, client):
        resp = client.post("/auth/logout")
        assert resp.status_code == 401
