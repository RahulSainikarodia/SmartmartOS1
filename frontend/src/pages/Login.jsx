import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('customer'); // UI role selection
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginApi(formData);
      
      // Check if the actual user role matches the selected login role
      if (data.role !== role) {
        setError(`This account is registered as a ${data.role}, not a ${role}.`);
        setLoading(false);
        return;
      }

      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Login to your SmartMart OS account</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex mb-8 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 rounded-lg font-bold transition ${
            role === 'customer' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setRole('admin')}
          className={`flex-1 py-2 rounded-lg font-bold transition ${
            role === 'admin' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Shop Owner
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-sm font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition font-bold disabled:bg-primary-300 shadow-md mt-4"
        >
          {loading ? 'Logging in...' : `Login as ${role === 'admin' ? 'Owner' : 'Customer'}`}
        </button>
      </form>
      <p className="mt-8 text-center text-gray-600">
        Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
