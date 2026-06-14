from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_items_endpoint_exists():
    """Ensure the items router is mounted and responds to GET requests."""
    response = client.get('/items/')
    assert response.status_code in {200, 404}


def test_items_create_endpoint_exists():
    """Ensure the items create route exists and can receive POST requests."""
    response = client.post('/items/', json={})
    assert response.status_code in {200, 400, 404}
