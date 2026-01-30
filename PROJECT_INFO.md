# Tech Stack & Project Architecture

This document explains the technical choices made for this assignment, why they are important, and where they are implemented.

## 1. Frontend: Vite + React (JSX)
- **What**: A modern build tool (Vite) with React and standard JavaScript (JSX).
- **Why**: 
    - **Optimization**: Vite is significantly faster than Create React App, providing near-instant Hot Module Replacement (HMR).
    - **Simplicity**: Using plain JavaScript simplifies the development workflow and avoids type overhead for quick assignments.
    - **JSX**: Standard React extension for building components.
- **Where**: All files in `/frontend/src`.

## 2. Global State Management: Redux Toolkit (RTK)
- **What**: The official, opinionated toolset for efficient Redux development.
- **Why**:
    - **Important**: For complex assignments, `useContext` can lead to "prop drilling" or performance issues (re-rendering everything). RTK is optimized to only re-render components that actually use specific data.
    - **Scalability**: As the assignment grows, managing state in one central "store" is much cleaner.
- **Where**: 
    - `/frontend/src/app/store.ts` (The central brain).
    - `/frontend/src/features/` (Where actual data logic lives).

## 3. Backend: Node.js + Express
- **What**: A lightweight web framework for Node.js.
- **Why**:
    - **Performance**: High-performance, non-blocking I/O.
    - **Simplicity**: Easy to set up RESTful APIs.
- **Where**: `/backend/index.js`.

## 4. API Communication: Axios
- **What**: A promise-based HTTP client.
- **Why**: 
    - **Better Defaults**: Automatically transforms JSON data and has better error handling than the native `fetch` API.
    - **Interceptors**: Can be used to add tokens or headers to every request automatically.
- **Where**: `/frontend/src/services/api.ts`.

## 5. UI & Aesthetics: Glassmorphism (Vanilla CSS)
- **What**: A modern UI trend characterized by transparency and background blur.
- **Why**: 
    - **Premium Feel**: Uses gradients, high-quality backgrounds, and `backdrop-filter` to create a state-of-the-art look.
    - **Performance**: Vanilla CSS is faster than heavy libraries (like Bootstrap) for custom designs.
- **Where**: `/frontend/src/index.css`.

## 6. Routing: React Router DOM
- **What**: The standard routing library for React.
- **Why**: 
    - Enables "Single Page Application" (SPA) behavior, allowing users to navigate without page reloads.
- **Where**: `/frontend/src/routes/AppRoutes.tsx`.

## 7. Development Tools
- **Nodemon**: Automatically restarts the backend server when you save changes.
- **Dotenv**: Keeps sensitive information (like API keys) out of the code and in a secure `.env` file.

---

### How to use this project?
When you start building:
1.  **Add Components** to `frontend/src/components`.
2.  **Add New State** to `frontend/src/features`.
3.  **Add Backend Routes** in `backend/index.js`.
4.  **Connect them** using the `api.ts` service.
