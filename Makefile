up:
	docker compose up --build -d
down:
	docker compose down
logs:
	docker compose logs -f
smoke:
	curl -s localhost:8080/api/products; echo
	curl -s -X POST localhost:8080/api/orders -H "content-type: application/json" -d '{"productId":"1","qty":2}'; echo
	curl -s localhost:8080/api/stock/1; echo
	@echo "Storefront: http://localhost:8090"
k8s-up:
	kubectl apply -f k8s/namespace.yaml -f k8s/services.yaml
