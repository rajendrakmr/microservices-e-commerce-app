from fastapi.testclient import TestClient
from main import app
c = TestClient(app)

def test_list():
    assert len(c.get("/products").json()) == 3

def test_missing():
    assert c.get("/products/999").status_code == 404
