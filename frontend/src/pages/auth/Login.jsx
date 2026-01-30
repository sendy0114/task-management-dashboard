import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);

    const selectedRole = location.state?.role || 'user';

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex bg-white font-inter">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img src="/auth_image.png" alt="Illustration" className="w-full mb-8" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Focused on Productivity</h2>
                    <p className="text-gray-500">Log in as <span className="text-primary-purple font-bold uppercase">{selectedRole}</span> to get started.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Sign In</h1>
                    <p className="text-gray-500 mb-10">Access your dashboard as {selectedRole}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-purple focus:bg-white outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-purple focus:bg-white outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-purple text-white rounded-xl font-bold shadow-lg shadow-primary-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" state={{ role: selectedRole }} className="text-primary-purple font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
