# E-commerce Backend API

A robust Node.js backend API for the e-commerce application built with Express, MongoDB, and JWT authentication.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with image upload support
- **Order Processing**: Complete order lifecycle management
- **Category Management**: Hierarchical product categorization
- **File Upload**: Multer integration for product images
- **Security**: bcrypt password hashing, CORS configuration, input validation
- **Error Handling**: Centralized error handling with custom middleware

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Installation

```bash
cd backend
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://somalisisichannel:EWqhMS8TsIZEwK8v@ecommerce.xujifmk.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce
JWT_SECRET=supersecret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Run the Server

```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters, search, pagination)
- `GET /api/products/:slug` - Get single product by slug
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### File Upload
- `POST /api/uploads` - Upload single image (Admin only)
- `POST /api/uploads/multiple` - Upload multiple images (Admin only)

## Database Models

### User Model
- Authentication and profile information
- Role-based access control (user/admin)
- Address management
- Password hashing with bcrypt

### Product Model
- Complete product information with variants
- Image gallery support
- Review and rating system
- Stock management
- SEO-friendly slugs

### Category Model
- Product categorization
- Hierarchical structure support
- SEO optimization

### Order Model
- Complete order lifecycle
- Status tracking
- Payment integration ready
- Shipping information

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: express-validator for request validation
- **Error Handling**: Centralized error handling middleware
- **File Upload Security**: File type and size validation

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Route controllers
├── middleware/              # Custom middleware
├── models/                  # Mongoose models
├── routes/                  # API routes
├── utils/                   # Utility functions
├── uploads/                 # File uploads directory
├── .env.example            # Environment variables template
├── server.js               # Main server file
└── package.json            # Project dependencies
```

## Development

The API is built with modern JavaScript (ES6+) using ES modules. It includes comprehensive error handling, input validation, and follows RESTful conventions.

For development, the server uses nodemon for automatic restarts when files change.