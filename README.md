# Assignment Project

This project contains an optimized full-stack setup with a React frontend and a Node.js backend.

## Structure
- `/frontend`: React + Vite + JSX + Redux Toolkit
- `/backend`: Node.js + Express + Nodemon

## How to Run

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5001`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available on `http://localhost:5173` (or the port shown in terminal).

## State Management
- **Redux Toolkit**: Used for global state management (see `frontend/src/app/store.ts`).
- **Hooks**: Custom typed hooks used for dispatch and selection.

## Tech Stack
- **Frontend**: React, Vite, Redux Toolkit, Axios, CSS Glassmorphism.
- **Backend**: Express, CORS, Dotenv.
