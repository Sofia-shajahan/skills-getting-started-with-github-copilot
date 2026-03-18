import pytest
from fastapi.testclient import TestClient
from src.app import app


class TestActivitiesAPI:
    """Test suite for the Activities API endpoints."""

    def test_get_activities_success(self, client):
        """Test GET /activities returns all activities with correct structure."""
        response = client.get("/activities")

        assert response.status_code == 200
        data = response.json()

        # Should return a dictionary of activities
        assert isinstance(data, dict)
        assert len(data) > 0  # Should have activities

        # Check structure of first activity
        first_activity = next(iter(data.values()))
        required_keys = ["description", "schedule", "max_participants", "participants"]
        for key in required_keys:
            assert key in first_activity
            if key == "participants":
                assert isinstance(first_activity[key], list)

    def test_post_signup_success(self, client, test_email):
        """Test successful signup to an activity."""
        activity_name = "Soccer"  # Assuming this activity exists

        response = client.post(
            f"/activities/{activity_name}/signup",
            json={"email": test_email}
        )

        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert test_email in data["message"]

    def test_post_signup_activity_not_found(self, client, test_email):
        """Test signup to non-existent activity."""
        activity_name = "NonExistentActivity"

        response = client.post(
            f"/activities/{activity_name}/signup",
            json={"email": test_email}
        )

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_post_signup_duplicate(self, client, test_email):
        """Test duplicate signup to same activity."""
        activity_name = "Soccer"

        # First signup
        client.post(
            f"/activities/{activity_name}/signup",
            json={"email": test_email}
        )

        # Second signup (should fail)
        response = client.post(
            f"/activities/{activity_name}/signup",
            json={"email": test_email}
        )

        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_delete_unregister_success(self, client, test_email):
        """Test successful unregister from an activity."""
        activity_name = "Basketball"

        # First signup
        client.post(
            f"/activities/{activity_name}/signup",
            json={"email": test_email}
        )

        # Then unregister
        response = client.delete(
            f"/activities/{activity_name}/unregister",
            json={"email": test_email}
        )

        assert response.status_code == 200
        data = response.json()
        assert "message" in data

    def test_delete_unregister_activity_not_found(self, client, test_email):
        """Test unregister from non-existent activity."""
        activity_name = "NonExistentActivity"

        response = client.delete(
            f"/activities/{activity_name}/unregister",
            json={"email": test_email}
        )

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_delete_unregister_not_signed_up(self, client, test_email):
        """Test unregister when student is not signed up."""
        activity_name = "Soccer"

        response = client.delete(
            f"/activities/{activity_name}/unregister",
            json={"email": test_email}
        )

        assert response.status_code == 400
        data = response.json()
        assert "detail" in data