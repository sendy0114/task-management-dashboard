import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchTasks, updateTaskStatus } from '../features/tasks/taskSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { stats, tasks, searchTerm } = useSelector((state) => state.tasks);
    const [filter, setFilter] = useState('All');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchTasks());
    }, [dispatch]);

    const statCards = [
        {
            title: 'My Tasks',
            subtitle: 'All tasks assigned to you',
            count: stats.total,
            gradient: 'from-blue-400 to-blue-200',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Pending Tasks',
            subtitle: 'Tasks waiting to be started',
            count: stats.pending,
            gradient: 'from-yellow-400 to-yellow-200',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'In Progress',
            subtitle: 'Tasks currently being worked on',
            count: stats.inProgress,
            gradient: 'from-purple-400 to-purple-200',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Completed Tasks',
            subtitle: 'Tasks you\'ve finished',
            count: stats.completed,
            gradient: 'from-green-400 to-green-200',
            bgColor: 'bg-green-50'
        },
    ];

    // Memoize filtered tasks to avoid recalculation on every render
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesFilter = filter === 'All' || task.status === filter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.taskId.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [tasks, filter, searchTerm]);

    // Memoize status color function
    const getStatusColor = useCallback((status) => {
        if (status === 'Pending') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (status === 'In Progress') return 'text-purple-600 bg-purple-50 border-purple-200';
        return 'text-green-600 bg-green-50 border-green-200';
    }, []);

    const handleStatusUpdate = useCallback(async (e) => {
        e.preventDefault();
        const result = await dispatch(updateTaskStatus({ id: selectedTask.id, status: newStatus }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Status updated successfully');
            setIsStatusModalOpen(false);
            setSelectedTask(null);
        } else {
            toast.error('Failed to update status');
        }
    }, [dispatch, selectedTask, newStatus]);

    const openStatusModal = useCallback((task) => {
        setSelectedTask(task);
        setNewStatus(task.status);
        setIsStatusModalOpen(true);
    }, []);

    const openTaskDetails = useCallback((task) => {
        setSelectedTask(task);
        setIsTaskDetailsOpen(true);
    }, []);



    return (
        <DashboardLayout title="Dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, idx) => (
                    <div key={idx} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">{stat.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">{stat.subtitle}</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-bold text-gray-900">{stat.count}</span>
                            <div className="flex gap-0.5 items-end h-12">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 bg-gradient-to-t ${stat.gradient} rounded-full`}
                                        style={{ height: `${Math.random() * 60 + 40}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* My Tasks Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">My Tasks</h2>
                    <p className="text-sm text-gray-500">Track and update your assigned tasks</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
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

                {/* Tasks Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                <th className="pb-3 font-semibold">Assigned To</th>
                                <th className="pb-3 font-semibold">Task Title</th>
                                <th className="pb-3 font-semibold">Assigned By</th>
                                <th className="pb-3 font-semibold">Status</th>
                                <th className="pb-3 font-semibold">Created On</th>
                                <th className="pb-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 text-sm text-gray-900">{task.taskId}</td>
                                    <td className="py-4 text-sm font-medium text-gray-900">{task.title}</td>
                                    <td className="py-4 text-sm text-gray-600">{task.assignedBy}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-gray-600">
                                        {new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 flex gap-2">
                                        <button
                                            onClick={() => openTaskDetails(task)}
                                            className="text-primary-purple text-sm font-medium hover:underline"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => openStatusModal(task)}
                                            className="px-4 py-1.5 bg-primary-purple text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Details Modal */}
            {isTaskDetailsOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Task Details</h3>
                            <button onClick={() => setIsTaskDetailsOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Status */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                                    <button
                                        onClick={() => {
                                            setIsTaskDetailsOpen(false);
                                            openStatusModal(selectedTask);
                                        }}
                                        className="text-xs text-primary-purple font-semibold hover:underline"
                                    >
                                        Update status
                                    </button>
                                </div>
                                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>

                            {/* Task Title */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Task Title</span>
                                <p className="text-sm font-medium text-gray-900">{selectedTask.title}</p>
                            </div>

                            {/* Assigned By */}
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Assigned By</span>
                                <p className="text-sm text-gray-900">{selectedTask.assignedBy || 'Admin'}</p>
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

                        {/* Close Button */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setIsTaskDetailsOpen(false)}
                                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {isStatusModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Task Status</h3>
                            <button onClick={() => setIsStatusModalOpen(false)}>
                                <LuX className="text-xl text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                        <form onSubmit={handleStatusUpdate} className="space-y-4">
                            {/* Current Status Display */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTask.status)}`}>
                                        {selectedTask.status}
                                    </span>
                                </div>
                            </div>

                            {/* Task Info */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                                <p className="text-sm text-gray-900">{selectedTask.title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned By</label>
                                <p className="text-sm text-gray-900">{selectedTask.assignedBy || 'Admin'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task ID</label>
                                <p className="text-sm text-gray-900">#{selectedTask.taskId}</p>
                            </div>

                            {/* Update Status Dropdown */}
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

                            {/* Action Buttons */}
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
        </DashboardLayout>
    );
};

export default UserDashboard;
