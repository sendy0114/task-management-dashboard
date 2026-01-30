import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupUser({ ...formData, role: selectedRole }));
    };

    return (
        <div className="min-h-screen flex bg-white font-inter">
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img src="/auth_image.png" alt="Illustration" className="w-full mb-8" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Join the Workflow</h2>
                    <p className="text-gray-500">Create your account as <span className="text-primary-purple font-bold uppercase">{selectedRole}</span>.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-10">Start managing tasks efficiently</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-purple focus:bg-white outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@company.com"
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-purple focus:bg-white outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-purple focus:bg-white outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-purple text-white rounded-xl font-bold shadow-lg shadow-primary-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up Now'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" state={{ role: selectedRole }} className="text-primary-purple font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
