import { useNavigate } from 'react-router-dom';
import { LuUser, LuShieldCheck } from 'react-icons/lu';

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white font-inter">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img src="/auth_image.png" alt="Illustration" className="w-full mb-8" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Tasks Effortlessly</h2>
                    <p className="text-gray-500">The most intuitive way to organize your team&apos;s workflow and boost productivity.</p>
                </div>
            </div>

            {/* Right Side: Role Selection */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 mb-10">Please select your role to continue</p>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login', { state: { role: 'admin' } })}
                            className="w-full flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-purple hover:bg-primary-purple/5 transition-all group"
                        >
                            <div className="p-4 rounded-xl bg-primary-purple/10 text-primary-purple group-hover:bg-primary-purple group-hover:text-white transition-all">
                                <LuShieldCheck className="text-3xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-800">Admin Account</h3>
                                <p className="text-sm text-gray-500">Full access to manage tasks and team members</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/login', { state: { role: 'user' } })}
                            className="w-full flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-purple hover:bg-primary-purple/5 transition-all group"
                        >
                            <div className="p-4 rounded-xl bg-gray-100 text-gray-500 group-hover:bg-primary-purple group-hover:text-white transition-all">
                                <LuUser className="text-3xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-800">Team Member</h3>
                                <p className="text-sm text-gray-500">View and update your assigned tasks</p>
                            </div>
                        </button>
                    </div>

                    <p className="mt-12 text-center text-sm text-gray-400">
                        Powered by TaskManager Pro &bull; v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
