import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuListTodo, LuLogOut, LuUsers } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const adminLinks = [
        { name: 'Dashboard', path: '/admin-dashboard', icon: <LuLayoutDashboard /> },
        { name: 'All Tasks', path: '/all-tasks', icon: <LuListTodo /> },
        { name: 'Users', path: '/users', icon: <LuUsers /> },
    ];

    const userLinks = [
        { name: 'My Dashboard', path: '/user-dashboard', icon: <LuLayoutDashboard /> },
        { name: 'My Tasks', path: '/my-tasks', icon: <LuListTodo /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : userLinks;

    return (
        <div className="w-64 bg-sidebar-dark min-h-screen text-white flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-purple to-purple-400 bg-clip-text text-transparent">
                    TaskManager
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-purple text-white shadow-lg shadow-primary-purple/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-purple flex items-center justify-center font-bold">
                        {user?.fullName?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => dispatch(logout())}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                >
                    <LuLogOut className="text-xl" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
