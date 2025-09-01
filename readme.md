# 📦 Parcel Delivery API

A RESTful backend API for managing parcel creation, tracking, status updates, user roles, and logistics. Built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Base URL

```
https://parcel-delivery-backend-blush.vercel.app
```


---

## 🔐 Authentication

Some routes require authentication via JWT.

- **Authorization Header**:

  ```http
  Authorization: Bearer <token>
  ```

### User Roles:

- `admin`: Full system access
- `sender`: Can create and manage their own parcels
- `receiver`: Can track or cancel received parcels
- `super_admin`: Elevated privileges (if applicable)

---

## 📁 API Endpoints

### 📦 Parcels

#### `GET /parcels`

Get all parcels (supports filtering, pagination, and search)

- **Query Parameters:**

  - `searchTerm`: Search by `trackingId`, `type`, or `deliveryAddress`
  - `status`: Filter by parcel status
  - `type`: Filter by parcel type
  - `from`, `to`: Filter by creation date (ISO format)
  - `page`, `limit`, `sort`, `fields`

- **Auth**: Required (sender, admin, etc.)

---

#### `GET /parcel/:id`

Get parcel details by ID

- **Params**: `:id` — Parcel ID
- **Auth**: Required

---

#### `POST /parcels`

Create a new parcel

- **Body:**

```json
{
  "sender": "ObjectId",
  "receiverName": "string",
  "deliveryAddress": "string",
  "weight": 2.5,
  "type": "Normal"
}
```

- **Auth**: Sender only

---

#### `PATCH /parcel/status/:id`

Update the status of a parcel

- **Params**: `:id` — Parcel ID
- **Body:**

```json
{
  "status": "Shipped",
  "note": "optional comment"
}
```

- **Auth**: Admin only

---

#### `DELETE /parcel/cancel/:id`

Cancel a parcel (receiver only)

- **Params**: `:id` — Parcel ID
- **Auth**: Receiver only

---

### 👤 Users

#### `POST /auth/register`

Register a new user

- **Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "sender"
}
```

---

#### `POST /auth/login`

Login a user

- **Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response Example:**

```json
{
  "accessToken": "<jwt-token>",
  "user": {
    "_id": "string",
    "name": "string",
    "role": "sender"
  }
}
```

---

#### `GET /users/me`

Get logged-in user's profile

- **Auth**: Required

---

### 🛠️ Admin Endpoints

#### `GET /admin/users`

List all users

- **Auth**: Admin only

---

#### `PATCH /admin/users/:id/role`

Change user role

- **Params**: `:id` — User ID
- **Body:**

```json
{
  "role": "admin"
}
```

- **Auth**: Admin only

---

## 📈 Filtering & Pagination Example

```http
GET /parcels?status=Delivered&type=Express&searchTerm=123&page=2&limit=5&sort=-createdAt
```

---

## 🧪 Sample Auth Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Swagger / OpenAPI
- TypeScript

---
