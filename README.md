# QuickDrop - 10-Minute Grocery Delivery Full-Stack Web Application

**Author:** Vidushi Singh  
**Roll No.:** 53  
**Class:** D15A  
**Project Aim:** Web Application Design & Planning for Quick-Commerce Grocery Delivery  

---

## 1. Project Overview

QuickDrop is a high-performance full-stack web application built using the **MERN Stack (MongoDB, Express, React, Node.js)** with **Tailwind CSS**, **Socket.IO** (WebSockets), and **Docker**.

The application implements **4 Core Modules** across **8 Views**:
1. **Customer Module**:
   - **View 1: Customer Home Page**: Location selector, debounced search, category filters (*Dairy, Snacks, Groceries*), store cards with ratings.
   - **View 2: Store Catalog & Cart Page**: Store header, product cards with images, prices, discount tags, `+ Add` / quantity stepper, sticky bottom cart summary.
   - **View 3: Checkout Page**: Delivery address manager, itemized bill, payment method selector (*UPI, Card, COD*), form validation.
   - **View 4: Live Order Tracking Page**: Interactive delivery progress tracker (*Placed &rarr; Packing &rarr; Out for Delivery &rarr; Delivered*), real-time countdown timer, and missing item refund box.
2. **Vendor Module**:
   - **View 5: Vendor Order Page**: Incoming order list, item checklist for packing, out-of-stock toggle with instant customer refund.
   - **View 6: Vendor Inventory Page**: Store Online/Offline duty toggle, product search, and inline price & stock editor.
3. **Delivery Partner Module**:
   - **View 7: Delivery Partner Dashboard**: Driver Online/Offline duty switch, incoming delivery request pop-up card, pickup & drop-off route navigation, earnings summary.
4. **Admin Module**:
   - **View 8: Admin Dashboard**: System summary cards (*Total Sales, Active Stores, Active Drivers, Total Orders*), Vendor Approvals tab, and System Reports tab.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Context API, Custom Hooks (`useDebounce`, `useLocalStorage`).
- **Backend**: Node.js, Express.js, RESTful API architecture.
- **Database**: MongoDB & Mongoose ORM (Connected to local DB: `mongodb://127.0.0.1:27017/fsd_project`).
- **Real-Time Communication**: Socket.IO (WebSockets) for instant order state updates.
- **Security**: JSON Web Tokens (JWT), Bcrypt password hashing, role-based access control (RBAC), environment variables (`.env`).
- **Containerization & CI/CD**: Docker, Docker Compose, GitHub Actions (`.github/workflows/ci.yml`).

---

## 3. How to Run Locally

### Option A: Running with npm (Standard Development Mode)

#### 1. Setup & Start Backend Server
```bash
cd server
npm install
# Seed sample database (optional but recommended for viva)
node src/seed.js
npm run dev
# Server runs on http://localhost:5000
```

#### 2. Setup & Start Frontend Client
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

### Option B: Running with Docker (One-Command Deployment)

Make sure Docker Desktop is running, then in the project root:
```bash
docker compose up --build
```
- Frontend will be available at: `http://localhost:3000`
- Backend API will be available at: `http://localhost:5000`
- MongoDB will run inside container: `mongodb://localhost:27017`

---

## 4. How to Push to GitHub (For 3:00 PM Schedule)

When you are ready to push to your GitHub account:
```bash
# 1. Initialize git and commit all prepared files
git init
git add .
git commit -m "feat: complete full-stack quickdrop project with 8 views and docker/ci"

# 2. Add your GitHub repository remote URL
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 3. Push to GitHub
git push -u origin main
```

---

## 5. Checklist Coverage & Viva Q&A Guide

| Section | Checklist Topic | Implementation Location |
| :--- | :--- | :--- |
| **Section 1** | Responsive UI & Tailwind CSS | `client/tailwind.config.js`, `client/src/index.css`, `client/src/components/Navbar.jsx` |
| **Section 2** | React Hooks & Custom Hooks | `client/src/hooks/useDebounce.js`, `useLocalStorage.js`, `client/src/pages/OrderTracking.jsx` |
| **Section 3** | State Management (Context API) | `client/src/context/CartContext.jsx`, `AuthContext.jsx`, `ThemeContext.jsx` |
| **Section 4** | Backend REST API (CRUD) | `server/src/routes/`, `server/src/controllers/` |
| **Section 5** | MongoDB + Mongoose Schemas | `server/src/models/User.js`, `Store.js`, `Product.js`, `Order.js` |
| **Section 6** | Secure REST API | `server/src/middleware/errorHandler.js`, `server/.env`, bcrypt password hashing |
| **Section 7** | JWT Authentication & RBAC | `server/src/middleware/auth.js` (`protect`, `authorize`), `server/src/utils/generateToken.js` |
| **Section 8** | Real-Time WebSockets | `server/src/server.js` (Socket.IO server), `client/src/utils/socket.js`, `CartContext.jsx` |
| **Section 9** | Docker Containerization | `docker-compose.yml`, `client/Dockerfile`, `server/Dockerfile` |
| **Section 10** | DevOps & CI/CD Pipeline | `.github/workflows/ci.yml`, `vercel.json`, `render.yaml` |

---

### Important Viva Questions ("What Mam Can Ask"):

1. **Q: How does authentication work in your application?**
   - *A:* We use stateless JWT (JSON Web Token) authentication. When a user registers or logs in (`POST /api/auth/login`), the backend compares the bcrypt password hash. If valid, it signs a JWT containing the user's ID and role (`generateToken.js`). The client sends this token in the `Authorization: Bearer <token>` header, and our `protect` middleware verifies it before allowing access to private routes.

2. **Q: How do you prevent unauthorized access to Admin or Vendor endpoints?**
   - *A:* We implemented Role-Based Access Control (RBAC) via the `authorize(...roles)` middleware in `server/src/middleware/auth.js`. For example, `router.put('/status', protect, authorize('vendor', 'driver', 'admin'))` ensures customers cannot arbitrarily change order states.

3. **Q: How does Mongoose handle relationships between Orders, Stores, and Users?**
   - *A:* In `server/src/models/Order.js`, fields like `customer`, `store`, and `driver` are defined with `type: mongoose.Schema.Types.ObjectId, ref: 'User'`. When fetching orders, we use Mongoose `.populate('customer', 'name email')` to join related documents efficiently without manual lookup queries.

4. **Q: What is the benefit of using Docker Compose for this project?**
   - *A:* `docker-compose.yml` allows running the entire multi-tier system (React client, Node.js server, and MongoDB database) in isolated containers with a single command `docker compose up --build`, eliminating "it works on my machine" environment discrepancies.
