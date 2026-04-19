import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-[#1A2B4A] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-white mr-3" />
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">Karya</span>
              <span className="text-[#F59E0B]">Seva</span>
            </Link>
            <span className="ml-4 text-xs font-bold bg-[#10B981] text-white px-3 py-1 rounded-full uppercase tracking-wide">
              India First
            </span>
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/jobs" className="text-white hover:text-gray-300 font-medium transition duration-150">Browse Jobs</Link>
            
            {token ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-gray-300 font-medium transition duration-150">Dashboard</Link>
                <Link to="/profile" className="text-white hover:text-gray-300 font-medium transition duration-150">Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-red-400 hover:text-red-300 font-bold transition duration-150">Admin</Link>
                )}
                
                <div className="flex items-center ml-2 border-l border-gray-600 pl-6 space-x-4">
                  <span className="bg-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/20">
                    <span className="opacity-80 font-normal mr-1">Hello,</span>
                    {user?.name}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center text-white bg-red-600 hover:bg-red-700 font-bold px-4 py-2 rounded-lg transition duration-150 shadow-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6 ml-2 border-l border-gray-600 pl-6">
                <Link to="/login" className="text-white font-medium hover:text-gray-300 transition duration-150">Login</Link>
                <Link to="/register" className="bg-[#F59E0B] text-white hover:bg-orange-600 px-6 py-2.5 rounded-lg font-bold transition duration-150 shadow-md">
                  Register 
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
