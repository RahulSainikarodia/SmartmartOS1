import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'customer',
    area: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await registerApi(formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 mt-2">Join SmartMart OS today</p>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Your Area / City</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Downtown, Brooklyn"
            required
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">I want to...</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`p-3 border rounded-lg font-bold transition ${
                formData.role === 'customer' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Shop Items
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`p-3 border rounded-lg font-bold transition ${
                formData.role === 'admin' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Manage Shop
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition font-bold disabled:bg-primary-300 mt-6 shadow-md"
        >
          {loading ? 'Creating Account...' : 'Register Now'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
