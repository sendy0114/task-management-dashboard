# 🎯 Task Management Dashboard - Implementation Plan

This document breaks down the production-ready Task Management Dashboard into manageable "bricks". We will follow this step-by-step.

## 🏗️ Phase 1: Environment & Dependencies Setup
- [ ] **1.1 Backend Dependencies**: Install `express`, `firebase-admin`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`.
- [ ] **1.2 Frontend Dependencies**: Install `tailwindcss`, `postcss`, `autoprefixer`, `axios`, `react-router-dom`, `react-hot-toast`, `react-icons`, `@reduxjs/toolkit`, `react-redux`.
- [ ] **1.3 Tailwind Configuration**: Set up `tailwind.config.js` with specific colors:
    - Primary Purple: `#5B5FED`
    - Sidebar Dark: `#2D2D2D`
    - Background: `#F5F5F5`
    - Status Colors: Orange, Purple, Green.
- [ ] **1.4 Firebase Project**: (External) Create project in console, get `serviceAccountKey.json`.

## 🔐 Phase 2: Backend Core (The API)
- [ ] **2.1 Firebase Admin SDK**: Initialize in `backend/config/firebase.js`.
- [ ] **2.2 Auth Utilities**: Create `generateToken` and `verifyToken` helpers.
- [ ] **2.3 Middleware**: 
    - `authMiddleware`: Verify JWT and attach user to request.
    - `adminMiddleware`: Restrict access to Admins only.
- [ ] **2.4 Controllers**:
    - `authController`: Signup (hash password, save to Firestore), Login (verify pass, send JWT).
    - `taskController`: CRUD operations with auto-incrementing `TSKXXX` IDs and Firestore stats.
    - `userController`: List users for assignment (Admin only).
- [ ] **2.5 Routes**: Connect controllers to Express routes under `/api`.

## 🎛️ Phase 3: Frontend Foundation & State
- [ ] **3.1 API Service**: Configure Axios instance with Interceptors for JWT.
- [ ] **3.2 Redux Store Update**:
    - `authSlice`: Manage user identity and tokens.
    - `taskSlice`: Manage tasks, filters, and real-time state.
    - `userSlice`: Manage the list of assignable users.
- [ ] **3.3 Navigation**: Set up `react-router-dom` with `ProtectedRoute` for Admin and User roles.
- [ ] **3.4 UI Components (Atomic)**: 
    - `Button`, `Input`, `Badge` (Status), `StatCard`.
    - `Sidebar` (Dark theme), `Navbar`.

## 🔑 Phase 4: Authentication Flow
- [ ] **4.1 Role Selection Page**: Initial entry point.
- [ ] **4.2 Signup & Login Pages**: Including validation and "Hot Toast" notifications.
- [ ] **4.3 Session Management**: Persist JWT in `localStorage` and handle auto-login on refresh.

## 👑 Phase 5: Admin Dashboard (Feature Set)
- [ ] **5.1 Statistics Overview**: 4 stat cards with counts.
- [ ] **5.2 Task Management**: 
    - Table view with filters.
    - **Create/Edit Modal**: User assignment dropdown.
    - **Sliding Details Panel**: Full task view (slides from right).
    - **Delete Flow**: Confirmation modal.

## 👤 Phase 6: User Dashboard (Feature Set)
- [ ] **6.1 Personal Stats**: Filtered counts for the logged-in user.
- [ ] **6.2 My Tasks Table**: View-only details, "Update Status" button.
- [ ] **6.3 Status Update Modal**: Limited to changing status only.

## 🚀 Phase 7: Polish & Deployment
- [ ] **7.1 Real-time Updates**: Implement `onSnapshot` for tasks to reflect live changes.
- [ ] **7.2 Seed Data**: Script to populate the database with 10 sample tasks.
- [ ] **7.3 Final Testing**: Pixel-perfect check vs Figma.
- [ ] **7.4 Deployment**: Instructions for Render (Backend) and Vercel (Frontend).
