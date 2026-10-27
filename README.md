# Polyglot E-commerce Microservices (DevOps practice project)

| Service   | Language          | Port | Role                              |
|-----------|-------------------|------|-----------------------------------|
| frontend  | HTML/JS + nginx   | 8090 | Storefront UI, proxies /api       |
| gateway   | Node.js (Express) | 8080 | Single entry point / routing      |
| product   | Python (FastAPI)  | 8081 | Product catalog                   |
| inventory | Go                | 8082 | Stock levels & reservation        |
| order     | Java 21           | 8083 | Orders; calls inventory over HTTP |

Flow: `browser -> frontend (nginx) -> gateway -> product | order -> inventory`

## Run locally
    make up && make smoke
Storefront: http://localhost:8090
Prometheus: http://localhost:9090 | Grafana: http://localhost:3000 (admin/admin; add datasource http://prometheus:9090)

## DevOps practices covered
- Containers: multi-stage builds, non-root users, distroless (Go)
- CI: per-language tests, matrix image builds, Trivy scan, push to GHCR
- CD: kubectl apply + health-gated rollout status on main
- Kubernetes: probes, resource limits, HPA, Ingress, namespace
- Observability: /health and /metrics on every service, Prometheus + Grafana

## Extend it
1. PostgreSQL/Redis instead of in-memory data
2. Kafka/RabbitMQ for order events
3. Helm/Kustomize overlays (dev/staging/prod)
4. Terraform for the cluster, ArgoCD for GitOps
5. OpenTelemetry tracing, Alertmanager alerts
6. k6 load test and watch the HPA scale
