# Username API Documentation

## Overview
The backend now supports username-based user registration and authentication. Users can register with a unique username, first name, last name, email, and password.

## New User Registration

### Endpoint
`POST /api/auth/register`

### Request Body
```json
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

### Username Requirements
- Must be 3-20 characters long
- Can only contain letters, numbers, and underscores
- Must be unique across all users
- Cannot be empty

### Response Examples

#### Success (201 Created)
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Username Already Exists (400 Bad Request)
```json
{
  "success": false,
  "message": "Username already exists"
}
```

#### Email Already Exists (400 Bad Request)
```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Username can only contain letters, numbers, and underscores"
}
```

## User Login

### Endpoint
`POST /api/auth/login`

### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

### Response
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Get User Profile

### Endpoint
`GET /api/auth/me`

### Headers
```
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "avatar": "",
    "phone": "",
    "addresses": [],
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Update User Profile

### Endpoint
`PUT /api/auth/profile`

### Headers
```
Authorization: Bearer <token>
```

### Request Body (all fields optional)
```json
{
  "firstName": "Johnny",
  "lastName": "Smith",
  "email": "johnny.smith@example.com",
  "phone": "+1234567890"
}
```

### Response
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "firstName": "Johnny",
    "lastName": "Smith",
    "email": "johnny.smith@example.com",
    "role": "user"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors, duplicate username/email)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user not found)
- `500` - Internal Server Error

## Testing

You can test the username functionality using the provided test script:

```bash
node test-username.js
```

This script will:
1. Test user creation with username
2. Test duplicate username rejection
3. Test duplicate email rejection
4. Test successful unique user creation
5. Clean up test data
