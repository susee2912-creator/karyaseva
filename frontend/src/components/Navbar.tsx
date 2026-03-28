import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <Link to="/" className="ml-2 text-2xl font-bold text-gray-900 tracking-tight">KaryaSeva</Link>
            <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">India First</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Browse Jobs</Link>
            
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-500 mr-4 font-medium">{user?.name} ({user?.role})</span>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center">
                    <LogOut className="h-5 w-5 mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
