import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../features/notifications/notificationSlice';
import { setSearchTerm } from '../../features/tasks/taskSlice';
import { LuBell, LuSearch } from 'react-icons/lu';

const Navbar = ({ title }) => {
    const dispatch = useDispatch();
    const { list: notifications } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchNotifications());
            const interval = setInterval(() => {
                dispatch(fetchNotifications());
            }, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [dispatch, user]);

    return (
        <div className="h-20 bg-white/70 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
            <h2 className="text-xl font-bold text-gray-800">{title || 'Dashboard'}</h2>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-purple transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        className="bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-primary-purple shadow-sm transition-all text-sm outline-none"
                    />
                </div>

                <button className="p-2.5 bg-gray-100 rounded-xl text-gray-500 hover:text-primary-purple transition-all relative">
                    <LuBell className="text-xl" />
                    {notifications.length > 0 && (
                        <>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                {notifications.length}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Navbar;
