import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LuMail, LuUser } from 'react-icons/lu';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/tasks/users/list');
                setUsers(response.data);
            } catch {
                toast.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <DashboardLayout title="Team Members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-full flex items-center justify-center text-xl font-bold">
                            <LuUser />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">{user.fullName}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                <LuMail /> {user.email}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!loading && users.length === 0 && (
                <p className="text-center text-gray-500 py-10">No team members found.</p>
            )}
        </DashboardLayout>
    );
};

export default Users;
