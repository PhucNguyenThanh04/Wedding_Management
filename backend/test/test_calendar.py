"""Tests for Calendar & Availability endpoints:
GET /calendar?month=&year=
GET /calendar/day?date=
GET /halls/availability?date=&shift=&min_tables=
"""
import pytest
from datetime import date


class TestCalendarMonth:
    def test_get_calendar_month(self, client, staff_headers, sample_order):
        resp = client.get(
            "/calendar?month=6&year=2026",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["year"] == 2026
        assert data["month"] == 6
        assert data["total_events"] >= 1
        assert isinstance(data["events"], list)

        event = data["events"][0]
        assert "order_id" in event
        assert "customer_name" in event
        assert "hall_name" in event
        assert "event_shift" in event
        assert "event_type" in event
        assert "status" in event

    def test_get_calendar_month_empty(self, client, staff_headers):
        resp = client.get(
            "/calendar?month=1&year=2030",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_events"] == 0
        assert data["events"] == []

    def test_calendar_month_invalid_params(self, client, staff_headers):
        resp = client.get(
            "/calendar?month=13&year=2026",
            headers=staff_headers
        )
        assert resp.status_code == 422

    def test_calendar_month_missing_params(self, client, staff_headers):
        resp = client.get("/calendar", headers=staff_headers)
        assert resp.status_code == 422

    def test_unauthenticated_cannot_access_calendar(self, client):
        resp = client.get("/calendar?month=6&year=2026")
        assert resp.status_code == 401


class TestCalendarDay:
    def test_get_calendar_day(self, client, staff_headers, sample_order):
        resp = client.get(
            "/calendar/day?date=2026-06-15",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["date"] == "2026-06-15"
        assert data["total_events"] >= 1

        event = data["events"][0]
        assert event["order_id"] == sample_order.id
        assert event["event_shift"] == "EVENING"

    def test_get_calendar_day_empty(self, client, staff_headers):
        resp = client.get(
            "/calendar/day?date=2030-01-01",
            headers=staff_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_events"] == 0
        assert data["events"] == []

    def test_calendar_day_invalid_date(self, client, staff_headers):
        resp = client.get(
            "/calendar/day?date=not-a-date",
            headers=staff_headers
        )
        assert resp.status_code == 422

    def test_calendar_day_cancelled_orders_excluded(self, client, staff_headers, db, sample_order):
        from src.core.enums import OrderStatus
        sample_order.status = OrderStatus.cancelled
        db.commit()

        resp = client.get(
            "/calendar/day?date=2026-06-15",
            headers=staff_headers
        )
        assert resp.status_code == 200
        assert resp.json()["total_events"] == 0


class TestHallsAvailability:
    def test_halls_availability(self, client, sample_hall):
        resp = client.get("/halls/availability?date=2026-06-15")
        assert resp.status_code == 200
        data = resp.json()
        assert data["date"] == "2026-06-15"
        assert isinstance(data["items"], list)

    def test_halls_availability_with_booking(self, client, sample_order, sample_hall):
        """Hall with EVENING booked should show remaining shifts available."""
        resp = client.get("/halls/availability?date=2026-06-15")
        assert resp.status_code == 200
        data = resp.json()
        items = data["items"]
        assert len(items) >= 1

        hall_item = next(i for i in items if i["hall_id"] == sample_hall.id)
        assert "EVENING" in hall_item["booked_shifts"]
        assert "EVENING" not in hall_item["available_shifts"]
        # Other shifts should be available
        assert "MORNING" in hall_item["available_shifts"]
        assert "LUNCH" in hall_item["available_shifts"]
        assert "AFTERNOON" in hall_item["available_shifts"]

    def test_halls_availability_filter_by_shift(self, client, sample_order, sample_hall):
        """Filter by EVENING shift (which is booked) should exclude this hall."""
        resp = client.get("/halls/availability?date=2026-06-15&shift=EVENING")
        assert resp.status_code == 200
        data = resp.json()
        hall_ids = [i["hall_id"] for i in data["items"]]
        assert sample_hall.id not in hall_ids

    def test_halls_availability_filter_by_free_shift(self, client, sample_order, sample_hall):
        """Filter by MORNING (free) should include this hall."""
        resp = client.get("/halls/availability?date=2026-06-15&shift=MORNING")
        assert resp.status_code == 200
        data = resp.json()
        hall_ids = [i["hall_id"] for i in data["items"]]
        assert sample_hall.id in hall_ids

    def test_halls_availability_filter_by_min_tables(self, client, sample_hall):
        """Filter with min_tables within hall range should return it."""
        resp = client.get("/halls/availability?date=2026-12-01&min_tables=10")
        assert resp.status_code == 200
        data = resp.json()
        hall_ids = [i["hall_id"] for i in data["items"]]
        assert sample_hall.id in hall_ids

    def test_halls_availability_filter_by_too_many_tables(self, client, sample_hall):
        """Filter with min_tables exceeding hall max_tables should exclude it."""
        resp = client.get("/halls/availability?date=2026-12-01&min_tables=999")
        assert resp.status_code == 200
        data = resp.json()
        hall_ids = [i["hall_id"] for i in data["items"]]
        assert sample_hall.id not in hall_ids

    def test_halls_availability_no_bookings(self, client, sample_hall):
        """Date with no bookings should show all shifts available."""
        resp = client.get("/halls/availability?date=2027-01-01")
        assert resp.status_code == 200
        data = resp.json()
        items = data["items"]
        assert len(items) >= 1

        hall_item = next(i for i in items if i["hall_id"] == sample_hall.id)
        assert len(hall_item["available_shifts"]) == 4
        assert len(hall_item["booked_shifts"]) == 0

    def test_halls_availability_unavailable_hall_excluded(self, client, db, sample_hall):
        """Unavailable halls should not appear."""
        sample_hall.is_available = False
        db.commit()

        resp = client.get("/halls/availability?date=2027-01-01")
        assert resp.status_code == 200
        data = resp.json()
        hall_ids = [i["hall_id"] for i in data["items"]]
        assert sample_hall.id not in hall_ids

    def test_halls_availability_is_public(self, client, sample_hall):
        """Availability endpoint should be accessible without authentication."""
        resp = client.get("/halls/availability?date=2026-12-01")
        assert resp.status_code == 200

    def test_halls_availability_missing_date(self, client):
        resp = client.get("/halls/availability")
        assert resp.status_code == 422
