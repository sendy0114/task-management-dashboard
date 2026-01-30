import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../features/tasks/taskSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import TaskTable from '../components/dashboard/TaskTable';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';
import { LuFilter } from 'react-icons/lu';

const MyTasks = () => {
    const [filter, setFilter] = useState('');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks(filter));
    }, [dispatch, filter]);

    const handleStatusUpdateSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateTaskStatus({ id: selectedTask.id, status: newStatus }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Status updated');
            setIsStatusModalOpen(false);
        } else {
            toast.error('Update failed');
        }
    };

    const handleStatusUpdateClick = (task) => {
        setSelectedTask(task);
        setNewStatus(task.status);
        setIsStatusModalOpen(true);
    };

    return (
        <DashboardLayout title="My Assignments">
            <div className="flex justify-between items-center mb-8">
                <div className="relative">
                    <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-8 outline-none focus:ring-2 focus:ring-primary-purple transition-all text-sm font-semibold appearance-none cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <TaskTable
                tasks={tasks}
                isAdmin={false}
                onStatusUpdate={handleStatusUpdateClick}
                onView={(task) => { setSelectedTask(task); /* View logic could be added here similar to AllTasks */ }}
            />

            {/* Status Update Modal */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                title="Update Task Status"
            >
                <form onSubmit={handleStatusUpdateSubmit} className="space-y-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">Current Task: <span className="text-gray-900 font-bold">{selectedTask?.title}</span></p>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">New Status</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-purple focus:bg-white outline-none transition-all"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary-purple text-white rounded-xl font-bold shadow-lg shadow-primary-purple/20 transition-all hover:bg-opacity-90"
                    >
                        Update Status
                    </button>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default MyTasks;
