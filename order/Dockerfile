FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /src
COPY OrderService.java .
RUN javac OrderService.java

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /src/*.class .
RUN adduser -D app
USER app
EXPOSE 8083
CMD ["java", "OrderService"]
