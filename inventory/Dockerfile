# Floating minor tag => always the latest 1.26.x patch (stdlib security fixes ship in patch releases).
# CI builds with pull: true so a cached older base layer is never reused.
FROM golang:1.26-alpine AS build
ENV GOTOOLCHAIN=local CGO_ENABLED=0
WORKDIR /src
COPY go.mod main.go ./
RUN go build -trimpath -ldflags="-s -w" -o /inventory .

FROM gcr.io/distroless/static:nonroot
COPY --from=build /inventory /inventory
USER nonroot:nonroot
EXPOSE 8082
ENTRYPOINT ["/inventory"]
