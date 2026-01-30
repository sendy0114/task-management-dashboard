import { LuEye, LuPencil, LuTrash2, LuCircleCheck } from 'react-icons/lu';

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-status-pending/10 text-status-pending border-status-pending/20',
        'In Progress': 'bg-status-progress/10 text-status-progress border-status-progress/20',
        'Completed': 'bg-status-completed/10 text-status-completed border-status-completed/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
            {status}
        </span>
    );
};

const TaskTable = ({ tasks, onEdit, onDelete, onView, onStatusUpdate, isAdmin }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-widest">
                        <th className="px-6 py-2 pb-4">Task ID</th>
                        <th className="px-6 py-2 pb-4">Task Title</th>
                        <th className="px-6 py-2 pb-4">{isAdmin ? 'Assigned To' : 'Assigned By'}</th>
                        <th className="px-6 py-2 pb-4">Status</th>
                        <th className="px-6 py-2 pb-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="bg-white group hover:shadow-md transition-all duration-200">
                            <td className="px-6 py-5 rounded-l-2xl font-bold text-gray-500 text-sm">#{task.taskId}</td>
                            <td className="px-6 py-5">
                                <p className="font-bold text-gray-800">{task.title}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{task.description}</p>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {(isAdmin ? task.assignedUserName : task.assignedBy)?.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {isAdmin ? task.assignedUserName : task.assignedBy}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <StatusBadge status={task.status} />
                            </td>
                            <td className="px-6 py-5 rounded-r-2xl">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onView(task)}
                                        className="p-2 text-gray-400 hover:text-primary-purple hover:bg-primary-purple/5 rounded-lg transition-all"
                                    >
                                        <LuEye />
                                    </button>

                                    {isAdmin ? (
                                        <>
                                            <button
                                                onClick={() => onEdit(task)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <LuPencil />
                                            </button>
                                            <button
                                                onClick={() => onDelete(task)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <LuTrash2 />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => onStatusUpdate(task)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-primary-purple/10 text-primary-purple hover:bg-primary-purple hover:text-white rounded-lg transition-all text-xs font-bold"
                                        >
                                            <LuCircleCheck /> Update
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {tasks.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400">No tasks found. Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default TaskTable;
