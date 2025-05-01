# Secure Authentication System

A secure and scalable authentication system built with **Node.js**, **Express**, **Prisma**, and **React**. This project provides enterprise-grade authentication features, including **JWT-based authentication**, **login activity tracking**, and a modern, responsive frontend interface.

---

## Features

### 1. **JWT Authentication**

- Implements secure, stateless authentication using **JSON Web Tokens (JWT)**.
- Tokens are issued upon successful login and are required for accessing protected backend routes.
- The backend validates tokens using a secret key (`JWT_SECRET`) stored securely in environment variables.
- Token expiration ensures enhanced security, requiring users to reauthenticate after a set period.

### 2. **Login Activity Tracking**

- Tracks user login activity, including:
  - **Timestamps** of login events.
  - **User agents** (e.g., browser, device type).
  - **IP addresses** for additional security insights.
- Users can view their login history through the `/api/dashboard` endpoint.
- Data is stored in the `loginLog` table in the database, managed via **Prisma ORM**.

### 3. **Role-Based Access Control (RBAC)**

- Supports fine-grained access control with customizable user roles (e.g., `admin`, `user`).
- Middleware restricts access to specific routes based on user roles.
- Easily extendable to include additional roles or permissions.

### 4. **Frontend Integration**

- A **React-based frontend** communicates with the backend via **RESTful APIs**.
- Key frontend features include:
  - **User authentication** (login, signup, password recovery).
  - **Login activity visualization** with a modern, responsive UI.
  - **Role-based navigation** to display content based on user permissions.
- Built with **Framer Motion** for smooth animations and **React Router** for seamless navigation.

### 5. **Biometric Authentication (Optional)**

- Integrates with biometric authentication systems (e.g., fingerprint, face recognition) for enhanced security.
- Supports fallback to traditional password-based authentication.

---

## Project Structure

### Backend

The backend is built with **Node.js** and **Express**, using **Prisma** as the ORM for database interactions.

#### Folder Structure:

- **`src/`**: Contains the main application logic.
  - **`Controllers/`**: Handles business logic for authentication, user management, etc.
  - **`Routes/`**: Defines API endpoints for authentication and dashboard features.
  - **`Middleware/`**: Includes middleware for authentication, role-based access control, and error handling.
  - **`prisma.ts`**: Initializes and exports the Prisma client for database operations.
- **`prisma/schema.prisma`**: Defines the database schema, including tables for users, roles, and login logs.

### Frontend

The frontend is built with **React** and styled using **CSS modules** and **Framer Motion** for animations.

#### Folder Structure:

- **`src/components/`**: Reusable UI components (e.g., `Header`, `Footer`, `LoadingSpinner`).
- **`src/pages/`**: Page-level components (e.g., `Dashboard`, `Home`, `Login`).
- **`src/context/`**: Context providers for global state management (e.g., `AuthContext`).
- **`src/services/`**: API service functions for interacting with the backend.

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgreSQL** (or another database supported by Prisma)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/secure-auth-system.git
   cd secure-auth-system
   ```
