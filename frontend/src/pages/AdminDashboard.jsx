import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../features/tasks/taskSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuList, LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    const statCards = [
        {
            title: 'Total Tasks',
            subtitle: 'All tasks created so far',
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
            title: 'In Progress Tasks',
            subtitle: 'Tasks currently being worked on',
            count: stats.inProgress,
            gradient: 'from-purple-400 to-purple-200',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Completed Tasks',
            subtitle: 'Tasks that have been completed',
            count: stats.completed,
            gradient: 'from-green-400 to-green-200',
            bgColor: 'bg-green-50'
        },
    ];

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

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/all-tasks')}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-purple hover:shadow-lg transition-all text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-primary-purple transition-colors">
                                <LuList className="text-xl text-primary-purple group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">All tasks</h3>
                                <p className="text-sm text-gray-500">View and manage all posted tasks</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/all-tasks', { state: { openCreateModal: true } })}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-purple hover:shadow-lg transition-all text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-primary-purple transition-colors">
                                <LuPlus className="text-xl text-primary-purple group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Create Task</h3>
                                <p className="text-sm text-gray-500">Create new task and post</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
