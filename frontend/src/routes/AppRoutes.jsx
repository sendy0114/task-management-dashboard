import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RoleSelection from '../pages/auth/RoleSelection';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import AllTasks from '../pages/AllTasks';
import MyTasks from '../pages/MyTasks';
import Users from '../pages/Users';

const AppRoutes = () => {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<RoleSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Admin Routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/all-tasks"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AllTasks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Users />
                        </ProtectedRoute>
                    }
                />

                {/* Protected User Routes */}
                <Route
                    path="/user-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tasks"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <MyTasks />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
