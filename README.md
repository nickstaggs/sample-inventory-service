# Product Inventory API

A Node.js/Express API for managing products and inventory using DynamoDB via LocalStack.

## Features

- Product management (create, read)
- Inventory tracking (update stock levels)
- Local development with Docker and LocalStack
- TypeScript support

## Prerequisites

- Node.js 18+
- Docker
- Docker Compose

## Getting Started

### Recommended: Docker Compose (Best for Local Development)
```bash
git clone git@github.com:nickstaggs/sample-inventory-service.git
cd product-inventory-api
docker-compose up
```

This will:
1. Start LocalStack (DynamoDB) in a container
2. Build and start the API in a container
3. Automatically initialize the database tables
4. Make the API available at `http://localhost:3000`

### Alternative: Manual Setup (For Advanced Use Cases)
1. Clone the repository:
```bash
git clone git@github.com:nickstaggs/sample-inventory-service.git
cd product-inventory-api
```

2. Install dependencies:
```bash
npm install
```

3. Start LocalStack (in a separate terminal):
```bash
docker-compose up localstack
```

4. Initialize database:
```bash
npm run init-db
```

5. Run the API:
```bash
npm run dev
```

## Development Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start everything (recommended) |
| `npm run dev` | Run API in dev mode (manual setup) |
| `npm run build` | Build production assets |
| `npm run init-db` | Initialize database tables |

## API Documentation

### Health Check
- `GET /ping` - Simple health check endpoint
  Returns:
  ```text
  pong
  ```

### Products
- `POST /api/products` - Create a new product (optionally with initial inventory quantity)
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 19.99,
    "category": "Category",
    "initialQuantity": 100  // optional, defaults to 0
  }
  ```
  
Example inventory update (PUT /api/inventory):
```json
{
  "productId": "12345", 
  "quantity": 100
}
```
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Inventory
- `PUT /api/inventory` - Update inventory (creates if doesn't exist)
  ```json
  {
    "productId": "string (required)",
    "quantity": "number (required)",
    "location": "string (required)"
  }
  ```
- `GET /api/inventory/:productId` - Get inventory for product
  Returns:
  ```json
  {
    "id": "string",
    "productId": "string",
    "quantity": "number",
    "location": "string",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
  ```

Example requests are available in the [Postman collection](postman/Product%20Inventory%20API.postman_collection.json)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PROMETHEUS_ENDPOINT` | Prometheus metrics endpoint | `http://localhost:9090` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry collector endpoint | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service name for tracing | `product-inventory-api` |
| `AWS_ENDPOINT` | LocalStack endpoint | `http://localhost:4566` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `test` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `test` |
| `NODE_ENV` | Node environment | `development` |

## Project Structure

```
src/
├── index.ts            # Main application entry point
├── products/           # Product-related routes and services
├── inventory/          # Inventory-related routes and services
└── shared/             # Shared utilities and types
    ├── database/       # Database adapters
    ├── types.ts        # Type definitions
    └── utils.ts        # Utility functions
```

## Testing

The Postman collection includes sample requests for all endpoints. Import it into Postman to test the API.

## Troubleshooting

- If LocalStack fails to start, try:
  ```bash
  docker-compose down -v
  docker-compose up
  ```
- Check Docker logs for LocalStack container if DynamoDB isn't initializing
- Ensure ports 3000 (API) and 4566 (LocalStack) are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
