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

### 1. Clone the repository
```bash
git clone <repository-url>
cd product-inventory-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

## Development

### Running locally
```bash
npm run dev
```

### Building for production
```bash
npm run build
```

### Initializing the database
```bash
npm run init-db
```

## API Documentation

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Inventory
- `POST /api/inventory` - Update inventory (creates if doesn't exist)
- `GET /api/inventory/:productId` - Get inventory for product

Example requests are available in the [Postman collection](postman/Product%20Inventory%20API.postman_collection.json)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
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
