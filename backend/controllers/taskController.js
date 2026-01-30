const { db, admin } = require('../config/firebase');

// Helper to get next task ID (e.g., TSK001)
const getNextTaskId = async () => {
    const counterRef = db.collection('taskCounter').doc('tasks');

    return await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        let nextNum = 1;
        if (counterDoc.exists) {
            nextNum = counterDoc.data().lastTaskNumber + 1;
        }

        transaction.set(counterRef, { lastTaskNumber: nextNum });
        return `TSK${String(nextNum).padStart(3, '0')}`;
    });
};

const getTasks = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let tasksRef = db.collection('tasks');

        // Filter by role
        if (role === 'user') {
            tasksRef = tasksRef.where('assignedUserId', '==', userId);
        }

        // Optional status filter from query params
        const { status } = req.query;
        if (status) {
            tasksRef = tasksRef.where('status', '==', status);
        }

        // Removing orderBy temporarily to avoid index requirement issues
        const snapshot = await tasksRef.get();
        let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort in memory instead
        tasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, assignedUserId, assignedUserName } = req.body;

        // Auto-generate TSKXXX ID
        const taskId = await getNextTaskId();

        const newTask = {
            taskId,
            title,
            description,
            status: 'Pending',
            assignedUserId,
            assignedUserName,
            assignedBy: req.user.fullName || 'Admin',
            assignedByUserId: req.user.id,
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection('tasks').add(newTask);

        // Create Notification for the assigned user
        await db.collection('notifications').add({
            userId: assignedUserId,
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${title}`,
            taskId: docRef.id,
            read: false,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ id: docRef.id, ...newTask });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        await db.collection('tasks').doc(id).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const taskRef = db.collection('tasks').doc(id);
        const task = await taskRef.get();

        if (!task.exists) return res.status(404).json({ message: 'Task not found' });

        // Users can only update their own tasks (Middleware handles this but double check here if needed)
        if (req.user.role === 'user' && task.data().assignedUserId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: Not your task' });
        }

        await taskRef.update({ status, updatedAt: new Date().toISOString() });
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('tasks').doc(id).delete();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

const getStats = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let tasksRef = db.collection('tasks');

        if (role === 'user') {
            tasksRef = tasksRef.where('assignedUserId', '==', userId);
        }

        const snapshot = await tasksRef.get();
        const tasks = snapshot.docs.map(doc => doc.data());

        const stats = {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'Pending').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completed: tasks.filter(t => t.status === 'Completed').length,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

const getUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'user').get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            fullName: doc.data().fullName,
            email: doc.data().email
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const getNotifications = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const snapshot = await db.collection('notifications')
            .where('userId', '==', userId)
            .where('read', '==', false)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('notifications').doc(id).update({ read: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getStats,
    getUsers,
    getNotifications,
    markNotificationAsRead
};
