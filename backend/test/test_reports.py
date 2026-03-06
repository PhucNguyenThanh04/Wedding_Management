"""Tests for Reports/Dashboard endpoints:
GET /reports/revenue
GET /reports/orders/summary
GET /reports/orders/by-event-type
GET /reports/halls/utilization
GET /reports/top-menus
GET /reports/staff/performance
"""
import pytest
from decimal import Decimal


class TestRevenueReport:
    def test_revenue_by_month(self, client, owner_headers, confirmed_order):
        resp = client.get(
            "/reports/revenue?period=month&year=2026&month=6",
            headers=owner_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["period_type"] == "month"
        assert data["year"] == 2026
        assert len(data["items"]) == 1
        assert data["items"][0]["period"] == "2026-06"
        assert data["items"][0]["total_orders"] >= 1
        assert float(data["items"][0]["total_revenue"]) > 0

    def test_revenue_all_months(self, client, owner_headers):
        resp = client.get(
            "/reports/revenue?period=month&year=2026",
            headers=owner_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 12

    def test_revenue_by_quarter(self, client, owner_headers):
        resp = client.get(
            "/reports/revenue?period=quarter&year=2026&quarter=1",
            headers=owner_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["period_type"] == "quarter"
        assert len(data["items"]) == 1
        assert data["items"][0]["period"] == "2026-Q1"

    def test_revenue_all_quarters(self, client, owner_headers):
        resp = client.get(
            "/reports/revenue?period=quarter&year=2026",
            headers=owner_headers
        )
        assert resp.status_code == 200
        assert len(resp.json()["items"]) == 4

    def test_revenue_by_year(self, client, owner_headers, confirmed_order):
        resp = client.get(
            "/reports/revenue?period=year&year=2026",
            headers=owner_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["period_type"] == "year"
        assert len(data["items"]) == 1
        assert float(data["grand_total"]) > 0

    def test_revenue_invalid_period(self, client, owner_headers):
        resp = client.get(
            "/reports/revenue?period=decade&year=2026",
            headers=owner_headers
        )
        assert resp.status_code == 422

    def test_staff_cannot_access_revenue(self, client, staff_headers):
        resp = client.get(
            "/reports/revenue?period=year&year=2026",
            headers=staff_headers
        )
        assert resp.status_code == 403

    def test_unauthenticated_cannot_access_revenue(self, client):
        resp = client.get("/reports/revenue?period=year&year=2026")
        assert resp.status_code == 401


class TestOrdersSummary:
    def test_orders_summary(self, client, owner_headers, sample_order):
        resp = client.get("/reports/orders/summary", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_orders"] >= 1
        assert "booking_pending" in data
        assert "confirmed" in data
        assert "completed" in data
        assert "cancelled" in data
        assert "invoiced" in data
        assert "in_progress" in data

    def test_orders_summary_empty(self, client, owner_headers):
        resp = client.get("/reports/orders/summary", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_orders"] >= 0

    def test_staff_cannot_access_summary(self, client, staff_headers):
        resp = client.get("/reports/orders/summary", headers=staff_headers)
        assert resp.status_code == 403


class TestRevenueByEventType:
    def test_revenue_by_event_type(self, client, owner_headers, sample_order):
        resp = client.get("/reports/orders/by-event-type", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert isinstance(data["items"], list)

    def test_revenue_by_event_type_has_order_data(self, client, owner_headers, confirmed_order):
        resp = client.get("/reports/orders/by-event-type", headers=owner_headers)
        assert resp.status_code == 200
        items = resp.json()["items"]
        # Should have at least one entry for "wedding"
        wedding_items = [i for i in items if i["event_type"] == "wedding"]
        assert len(wedding_items) >= 1
        assert wedding_items[0]["total_orders"] >= 1


class TestHallsUtilization:
    def test_halls_utilization(self, client, owner_headers, sample_hall, sample_order):
        resp = client.get("/reports/halls/utilization", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) >= 1
        item = data["items"][0]
        assert "hall_id" in item
        assert "hall_name" in item
        assert "total_bookings" in item
        assert "utilization_rate" in item

    def test_staff_cannot_access_utilization(self, client, staff_headers):
        resp = client.get("/reports/halls/utilization", headers=staff_headers)
        assert resp.status_code == 403


class TestTopMenus:
    def test_top_menus_empty(self, client, owner_headers):
        resp = client.get("/reports/top-menus", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert isinstance(data["items"], list)

    def test_top_menus_with_data(self, client, owner_headers, staff_headers,
                                  sample_order, sample_menu):
        # Add menu to order
        client.post(
            f"/orders/{sample_order.id}/menus",
            json={"menu_id": sample_menu.id, "quantity": 3},
            headers=staff_headers
        )

        resp = client.get("/reports/top-menus", headers=owner_headers)
        assert resp.status_code == 200
        items = resp.json()["items"]
        assert len(items) >= 1
        assert items[0]["menu_name"] == sample_menu.name


class TestStaffPerformance:
    def test_staff_performance(self, client, owner_headers, sample_order):
        resp = client.get("/reports/staff/performance", headers=owner_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) >= 1
        item = data["items"][0]
        assert "staff_id" in item
        assert "staff_name" in item
        assert "total_orders_created" in item
        assert "total_revenue" in item

    def test_staff_cannot_access_performance(self, client, staff_headers):
        resp = client.get("/reports/staff/performance", headers=staff_headers)
        assert resp.status_code == 403
