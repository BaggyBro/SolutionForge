from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "AI Solution Builder API"}

def test_discovery_validation_error():
    # If we pass incomplete data, it should return 422 Unprocessable Entity
    response = client.post("/api/discovery", json={})
    assert response.status_code == 422
