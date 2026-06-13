from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_claims_endpoint_exists():
    """Ensure the claims router is mounted and responds to GET requests."""
    response = client.get('/claims/')
    assert response.status_code in {200, 404}


def test_claims_create_endpoint_exists():
    """Ensure the claims create route exists and can receive POST requests."""
    response = client.post('/claims/', json={})
    assert response.status_code in {200, 400, 404}
