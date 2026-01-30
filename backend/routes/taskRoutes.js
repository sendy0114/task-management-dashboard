const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getStats,
    getUsers,
    getNotifications,
    markNotificationAsRead
} = require('../controllers/taskController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Notification routes (must be before /:id routes)
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

// Admin user list (static route)
router.get('/users/list', adminMiddleware, getUsers);

// Shared routes
router.get('/', getTasks);
router.get('/stats', getStats);
router.patch('/:id/status', updateTaskStatus);

// Admin only routes
router.post('/', adminMiddleware, createTask);
router.put('/:id', adminMiddleware, updateTask);
router.delete('/:id', adminMiddleware, deleteTask);

module.exports = router;
