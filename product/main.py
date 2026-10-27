from fastapi import FastAPI, HTTPException
from prometheus_client import make_asgi_app

app = FastAPI(title="product-service")
app.mount("/metrics", make_asgi_app())

PRODUCTS = {
    "1": {"id": "1", "name": "Mechanical Keyboard", "price": 89.99},
    "2": {"id": "2", "name": "Wireless Mouse", "price": 39.50},
    "3": {"id": "3", "name": "USB-C Hub", "price": 54.00},
}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/products")
def list_products():
    return list(PRODUCTS.values())

@app.get("/products/{pid}")
def get_product(pid: str):
    if pid not in PRODUCTS:
        raise HTTPException(404, "product not found")
    return PRODUCTS[pid]
