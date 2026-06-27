# Resource Manager Backend

This is the Java Spring Boot backend for the Resource Manager application.

## Requirements

- Java 21
- PostgreSQL

## Environment Variables

Configure these environment variables before running (or rely on defaults in `application.yml`):
- `DATABASE_URL` (default: `jdbc:postgresql://localhost:5432/rms`)
- `DATABASE_USER` (default: `postgres`)
- `DATABASE_PASSWORD` (default: `postgres`)
- `JWT_SECRET` (default: generated secret)
- `GEMINI_API_KEY` (required for InsightsService to function properly)
- `FRONTEND_URL` (default: `http://localhost:5173`)

## Running Locally

1. Make sure you have a local PostgreSQL instance running and a database named `rms` created.
2. Use the Maven Wrapper to build and run:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   > Note: Using the `dev` profile will trigger the `DevDataSeeder` to populate sample data into the database.

## API Documentation

Swagger OpenAPI documentation is automatically generated. Once the application is running, you can access the UI at:
`http://localhost:8080/swagger-ui.html`

## Docker

To build and run via Docker:
```bash
docker build -t rms-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/rms rms-backend
```
