# 🚀 Roxiler Store Rating Platform

A full-stack web application that enables users to rate stores, administrators to manage users and stores, and store owners to monitor ratings and performance.

---

## 🧠 Overview

This platform implements a **role-based system** with three user types:

* 👤 **Normal User** → Browse and rate stores
* 👑 **Admin** → Manage users and stores
* 🏪 **Store Owner** → View ratings and analytics

Built with a modern full-stack architecture using **React, Node.js, Express, and PostgreSQL**.

---

## ✨ Features

### 🔐 Authentication

* Secure JWT-based login/signup
* Role-based access control

### 👤 Normal User

* View all stores
* Search & sort stores
* Submit and update ratings (1–5)

### 👑 Admin Dashboard

* Create stores
* View all users
* Pagination support
* Manage system data

### 🏪 Store Owner Dashboard

* View users who rated their store
* Average rating display
* Ratings chart visualization

---

## 📊 Advanced Features

* 📈 Charts using Chart.js
* 📄 Pagination for large datasets
* 🔔 Toast notifications (no alerts)
* 🎨 Modern UI with animations (Framer Motion)
* 🔒 Protected routes using React Router

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Chart.js
* React Toastify
* Framer Motion

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcrypt (password hashing)

---

## 🗄️ Database Design

### Users

* id, name, email, password, address, role

### Stores

* id, name, email, address, owner_id

### Ratings

* id, user_id, store_id, rating

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shafiqahmed-786/roxiler-store-rating.git
cd roxiler-store-rating
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/roxiler_db
JWT_SECRET=your_secret_key
```

Run server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Default Roles Setup

To make yourself admin:

```sql
UPDATE users SET role='ADMIN' WHERE email='your_email';
```

---

## 📈 Future Improvements

* Add real-time updates (WebSockets)
* Add pagination on backend
* Improve analytics dashboard
* Deploy on cloud (AWS/Vercel)

---

## 👨‍💻 Author

**Shafiq Ahmed**

---

## ⭐ If you like this project, give it a star!
