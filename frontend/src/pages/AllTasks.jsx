import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, deleteTaskThunk, updateTask } from '../features/tasks/taskSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LuX } from 'react-icons/lu';

const AllTasks = () => {
    const [filter, setFilter] = useState('All');
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openCreateModal) {
            setIsCreateModalOpen(true);
            // Clear state so it doesn't reopen on refresh (optional but good UX)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedUserId: '',
        assignedUserName: ''
    });



    const dispatch = useDispatch();
    const { tasks, searchTerm } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/tasks/users/list');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    // Handler Functions for Modals
    const openEditModal = (task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            assignedUserId: task.assignedUserId,
            assignedUserName: task.assignedUserName
        });
        setIsEditModalOpen(true);
    };

    const openStatusModal = (task) => {
        setSelectedTask(task);
        setNewStatus(task.status);
        setIsStatusModalOpen(true);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === formData.assignedUserId);
        const result = await dispatch(createTask({
            ...formData,
            assignedUserName: selectedUser?.fullName || formData.assignedUserName
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Task created successfully');
            setIsCreateModalOpen(false);
            setFormData({ title: '', description: '', assignedUserId: '', assignedUserName: '' });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === formData.assignedUserId);
        const result = await dispatch(updateTask({
            id: selectedTask.id,
            updates: {
                ...formData,
                assignedUserName: selectedUser?.fullName || formData.assignedUserName
            }
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Task updated successfully');
            setIsEditModalOpen(false);
            setSelectedTask(null);
        }
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        const result = await dispatch(deleteTaskThunk(selectedTask.id));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Task deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateTask({
            id: selectedTask.id,
            updates: { status: newStatus }
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Status updated successfully');
            setIsStatusModalOpen(false);
            setSelectedTask({ ...selectedTask, status: newStatus });
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'All' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.taskId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        if (status === 'Pending') return 'text-yellow-600 bg-yellow-50';
        if (status === 'In Progress') return 'text-blue-600 bg-blue-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <DashboardLayout title="All Tasks">
            <div className="flex gap-6 h-[calc(100vh-140px)]">
                {/* Left: Task List */}
                <div className="flex-1 bg-white rounded-2xl p-6 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">All Tasks</h2>
                            <p className="text-sm text-gray-500">Manage, assign and track tasks across your team</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary-purple text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all"
                        >
                            Create Task
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-4 border-b border-gray-200">
                        {['All', 'Pending', 'Completed', 'In Progress'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 font-medium text-sm transition-all ${filter === tab
                                    ? 'text-primary-purple border-b-2 border-primary-purple'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Task Table */}
                    <div className="overflow-auto flex-1">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white">
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3 font-semibold">Assigned To</th>
                                    <th className="pb-3 font-semibold">Task Title</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTask?.id === task.id ? 'bg-purple-50' : ''
                                            }`}
                                    >
                                        <td className="py-4 text-sm text-gray-900">{task.taskId}</td>
                                        <td className="py-4 text-sm font-medium text-gray-900">{task.title}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">
                                            {new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTask(task);
                                                }}
                                                className="text-primary-purple text-sm font-medium hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Task Details Panel */}
                {selectedTask && (
                    <div className="w-96 bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Task Details</h3>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <LuX className="text-xl" />
                            </button>
                        </div>

                        <div className="space-y-5 flex-1">
                            {/* Status */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                                    <button
                                        onClick={() => openStatusModal(selectedTask)}
                                        className="text-xs text-primary-purple font-semibold hover:underline"
                                    >
                                        Update status
                                    </button>
                                </div>
                                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>

                            {/* Task Title */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Task Title</span>
                                <p className="text-sm font-medium text-gray-900">{selectedTask.title}</p>
                            </div>

                            {/* Assigned To */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Assigned To</span>
                                <p className="text-sm text-gray-900">{selectedTask.assignedUserName}</p>
                            </div>

                            {/* Task ID */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Task ID</span>
                                <p className="text-sm font-medium text-gray-900">#{selectedTask.taskId}</p>
                            </div>

                            {/* Description */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Description</span>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {selectedTask.description || 'No description provided for this task.'}
                                </p>
                            </div>

                            {/* Activity History */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Activity History</span>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Task created by {selectedTask.assignedBy || 'Admin'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(selectedTask.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">
                                                {selectedTask.status === 'Completed' ? 'Task completed' :
                                                    selectedTask.status === 'In Progress' ? 'Task in progress' :
                                                        'Task not started'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => openEditModal(selectedTask)}
                                className="flex-1 px-4 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                            >
                                Edit Task
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Create Task</h3>
                            <button onClick={() => setIsCreateModalOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all"
                                    placeholder="Team Building Event"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="Briefly describe what needs to be done"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned User Dropdown</label>
                                <select
                                    required
                                    value={formData.assignedUserId}
                                    onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all"
                                >
                                    <option value="">Rahul</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Edit Task</h3>
                            <button onClick={() => setIsEditModalOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="Briefly describe what needs to be done"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned User Dropdown</label>
                                <select
                                    required
                                    value={formData.assignedUserId}
                                    onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all"
                                >
                                    {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Task Status</h3>
                            <button onClick={() => setIsStatusModalOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <form onSubmit={handleStatusUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl mb-4">
                                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-yellow-600 bg-yellow-100">
                                        {selectedTask.status}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                                <p className="text-sm text-gray-900 mb-4">{selectedTask.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
                                <p className="text-sm text-gray-900 mb-4">{selectedTask.assignedUserName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task ID</label>
                                <p className="text-sm text-gray-900 mb-4">{selectedTask.taskId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Update status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none transition-all"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2">Changing the status will update it for the assigned user</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Task Confirmation Modal */}
            {isDeleteModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Delete Task</h3>
                            <button onClick={() => setIsDeleteModalOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-base font-semibold text-gray-900 mb-2">Delete this task?</h4>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. The task will be permanently removed.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all"
                            >
                                Delete Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AllTasks;
