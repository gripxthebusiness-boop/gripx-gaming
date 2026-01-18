# GripX API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

Response:
```json
{
  "message": "User registered successfully"
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor"
  }
}
```

### Get Current User
**GET** `/auth/me`

Headers: Required Bearer token

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "editor",
  "isActive": true,
  "createdAt": "2024-01-18T10:30:00.000Z"
}
```

### Get All Users (Admin Only)
**GET** `/auth/users`

Headers: Required Bearer token (admin role)

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor",
    "isActive": true
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
]
```

### Update User Role (Admin Only)
**PUT** `/auth/users/:userId/role`

Headers: Required Bearer token (admin role)

Request body:
```json
{
  "role": "admin"
}
```

Valid roles: `"admin"`, `"editor"`

Response:
```json
{
  "message": "User role updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Deactivate User (Admin Only)
**PUT** `/auth/users/:userId/deactivate`

Headers: Required Bearer token (admin role)

Response:
```json
{
  "message": "User deactivated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "isActive": false
  }
}
```

## Product Endpoints

### Get All Products
**GET** `/products`

No authentication required.

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "GripX Pro Mouse",
    "category": "Mice",
    "price": "$79.99",
    "rating": 4.9,
    "image": "https://images.unsplash.com/...",
    "specs": "20,000 DPI, RGB, Wireless",
    "description": "Professional gaming mouse",
    "isActive": true,
    "createdAt": "2024-01-18T10:30:00.000Z"
  }
]
```

### Get Single Product
**GET** `/products/:id`

No authentication required.

Response:
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "GripX Pro Mouse",
  "category": "Mice",
  "price": "$79.99",
  "rating": 4.9,
  "image": "https://images.unsplash.com/...",
  "specs": "20,000 DPI, RGB, Wireless",
  "description": "Professional gaming mouse",
  "isActive": true
}
```

### Create Product (Editor/Admin Only)
**POST** `/products`

Headers: Required Bearer token (editor or admin role)

Request body:
```json
{
  "name": "GripX Pro Mouse",
  "category": "Mice",
  "price": "$79.99",
  "rating": 4.9,
  "image": "https://images.unsplash.com/photo-1616296425622-4560a2ad83de?w=400&q=80",
  "specs": "20,000 DPI, RGB, Wireless",
  "description": "Professional gaming mouse with ultra precision"
}
```

Response:
```json
{
  "message": "Product created",
  "product": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "GripX Pro Mouse",
    "category": "Mice",
    "price": "$79.99",
    "rating": 4.9,
    "image": "https://images.unsplash.com/...",
    "specs": "20,000 DPI, RGB, Wireless",
    "description": "Professional gaming mouse with ultra precision",
    "isActive": true
  }
}
```

### Update Product (Editor/Admin Only)
**PUT** `/products/:id`

Headers: Required Bearer token (editor or admin role)

Request body (send only fields to update):
```json
{
  "price": "$89.99",
  "rating": 5.0,
  "specs": "20,000 DPI, RGB, Wireless, Customizable Buttons"
}
```

Response:
```json
{
  "message": "Product updated",
  "product": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "GripX Pro Mouse",
    "category": "Mice",
    "price": "$89.99",
    "rating": 5.0,
    "image": "https://images.unsplash.com/...",
    "specs": "20,000 DPI, RGB, Wireless, Customizable Buttons",
    "description": "Professional gaming mouse with ultra precision",
    "isActive": true
  }
}
```

### Delete Product (Editor/Admin Only)
**DELETE** `/products/:id`

Headers: Required Bearer token (editor or admin role)

Note: Soft delete - sets `isActive` to false

Response:
```json
{
  "message": "Product deleted",
  "product": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "GripX Pro Mouse",
    "isActive": false
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

## Categories

Valid product categories:
- `Mice`
- `Keyboards`
- `Headsets`
- `Controllers`

## Examples with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"john_doe",
    "email":"john@example.com",
    "password":"secure123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"secure123"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"GripX Pro Mouse",
    "category":"Mice",
    "price":"$79.99",
    "rating":4.9,
    "image":"https://...",
    "specs":"20,000 DPI, RGB, Wireless"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

## Rate Limiting

Currently, there are no rate limits. For production, implement rate limiting middleware.

## Pagination

Currently, all products are returned without pagination. For large datasets, consider implementing pagination.
