# watoukuang-api (Rust + SQLite + Axum)

A simple, production-ready starter API for your `watoukaung-ui` frontend.

## Features
- Axum web framework
- SQLx (SQLite) with automatic table creation
- CORS enabled (allow all by default, configurable)
- Health check endpoint
- Example `items` CRUD

## Quickstart

1. Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env.example
```

2. Run the server:

```bash
cargo run
```

The API will start on `http://127.0.0.1:${PORT:-8080}`.

## API Endpoints

- GET `/health` — health check
- GET `/items` — list items
- GET `/items/:id` — get item by id
- POST `/items` — create item
- PUT `/items/:id` — update item
- DELETE `/items/:id` — delete item

### Example cURL

```bash
# Health
curl http://127.0.0.1:8080/health

# Create item
curl -X POST http://127.0.0.1:8080/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"First","description":"demo"}'

# List
curl http://127.0.0.1:8080/items

# Update
curl -X PUT http://127.0.0.1:8080/items/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"First-Updated","description":"changed"}'

# Delete
curl -X DELETE http://127.0.0.1:8080/items/1
```

## Notes
- Default CORS allows all origins to ease local development with Next.js on port 3000. Change in `src/main.rs` if needed.
- SQLite file defaults to `sqlite://watoukuang.db` at project root.
