import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LayoutDashboard, ShoppingBasket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200">
              <ShoppingBasket className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              SmartMart <span className="text-primary-600">OS</span>
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="flex items-center text-gray-600 hover:text-primary-600 font-bold transition">
                    <LayoutDashboard className="w-5 h-5 mr-1" />
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/shop" className="flex items-center text-gray-600 hover:text-primary-600 font-bold transition">
                    <ShoppingBasket className="w-5 h-5 mr-1" />
                    Shop
                  </Link>
                )}
                
                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700 capitalize">
                      {user.name} <span className="text-gray-400 font-medium ml-1">({user.area})</span>
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center text-red-500 hover:text-red-600 font-bold transition text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-700 font-bold hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
