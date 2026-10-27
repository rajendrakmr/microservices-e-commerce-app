FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 go build -o /inventory .

FROM gcr.io/distroless/static:nonroot
COPY --from=build /inventory /inventory
EXPOSE 8082
ENTRYPOINT ["/inventory"]
