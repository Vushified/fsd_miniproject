# QuickDrop REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Vidushi Singh",
  "email": "vidushi@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "+91 98765 43210",
  "address": "Bandra West, Mumbai"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6735c001...",
    "name": "Vidushi Singh",
    "email": "vidushi@example.com",
    "role": "customer"
  }
}
```

### 1.2 Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "vidushi@example.com",
  "password": "password123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 1.3 Get Current User (Profile)
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Access**: Private (Bearer Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "6735c001...",
    "name": "Vidushi Singh",
    "email": "vidushi@example.com",
    "role": "customer"
  }
}
```

---

## 2. Store Endpoints (`/api/stores`)

### 2.1 Get All Stores
- **Method**: `GET`
- **URL**: `/api/stores?category=Dairy&search=Amul`
- **Access**: Public
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6735c002...",
      "name": "Fresh Basket QuickMart",
      "category": "Groceries",
      "rating": 4.8,
      "distance": "1.2 km",
      "isOpen": true,
      "owner": { "name": "FreshBasket Merchant", "email": "vendor@example.com" }
    }
  ]
}
```

### 2.2 Update Store Status (Online/Offline)
- **Method**: `PUT`
- **URL**: `/api/stores/:id`
- **Access**: Private (Vendor, Admin)
- **Request Body**:
```json
{
  "isOpen": false
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Store updated successfully",
  "data": { ... }
}
```

---

## 3. Product Endpoints (`/api/products`)

### 3.1 Get Products By Store
- **Method**: `GET`
- **URL**: `/api/products/store/:storeId`
- **Access**: Public
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "6735c003...",
      "name": "Amul Taaza Milk 500ml",
      "category": "Dairy",
      "price": 33,
      "stock": 45,
      "inStock": true
    }
  ]
}
```

### 3.2 Update Product Price & Stock (Vendor Inventory)
- **Method**: `PUT`
- **URL**: `/api/products/:id`
- **Access**: Private (Vendor, Admin)
- **Request Body**:
```json
{
  "price": 35,
  "stock": 60,
  "inStock": true
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

---

## 4. Order Endpoints (`/api/orders`)

### 4.1 Place New Order
- **Method**: `POST`
- **URL**: `/api/orders`
- **Access**: Private (Customer)
- **Request Body**:
```json
{
  "store": "6735c002...",
  "items": [
    { "name": "Amul Milk", "price": 33, "quantity": 2 }
  ],
  "totalAmount": 71,
  "paymentMethod": "UPI",
  "deliveryAddress": "Flat 402, Bandra West, Mumbai"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "ORD-5821",
    "status": "Placed",
    "totalAmount": 71,
    "paymentMethod": "UPI"
  }
}
```

### 4.2 Update Order Status (Live Tracking State Machine)
- **Method**: `PUT`
- **URL**: `/api/orders/:id/status`
- **Access**: Private (Vendor, Driver, Admin)
- **Request Body**:
```json
{
  "status": "Packing" 
}
```
*(Status enum: `Placed` &rarr; `Packing` &rarr; `Out for Delivery` &rarr; `Delivered`)*
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order status updated to Packing",
  "data": { ... }
}
```
*Note: Triggers real-time WebSocket broadcast to all connected clients.*

### 4.3 Mark Item Out of Stock & Issue Refund
- **Method**: `PUT`
- **URL**: `/api/orders/:id/items/:itemId/outofstock`
- **Access**: Private (Vendor, Admin)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Item marked out of stock. Refund notification issued.",
  "data": {
    "missingItemRefund": {
      "amount": 33,
      "message": "Amul Milk was out of stock. Refund of ₹33 processed."
    }
  }
}
```

---

## 5. Admin Endpoints (`/api/admin`)

### 5.1 System Summary Metrics
- **Method**: `GET`
- **URL**: `/api/admin/metrics`
- **Access**: Private (Admin only)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalSales": 15420,
    "totalOrders": 86,
    "totalStores": 4,
    "activeStores": 3,
    "activeDrivers": 12
  }
}
```

### 5.2 Verify Pending Vendor Registration
- **Method**: `PUT`
- **URL**: `/api/admin/vendors/:id/verify`
- **Access**: Private (Admin only)
- **Request Body**:
```json
{
  "status": "Approved"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Vendor application approved successfully"
}
```
