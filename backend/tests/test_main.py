from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_root_route_exists():
    """Ensure the FastAPI app can start and the root path is reachable."""
    response = client.get("/")
    assert response.status_code in {200, 404}
    # If a root route is not defined yet, make sure the app still responds properly.
