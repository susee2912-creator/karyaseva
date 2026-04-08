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
    <nav className="bg-[#1A2B4A] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-white" />
            <Link to="/" className="ml-2 text-2xl font-bold text-white tracking-tight">KaryaSeva</Link>
            <span className="ml-3 text-xs font-semibold bg-[#10B981] text-white px-2.5 py-0.5 rounded-full">India First</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">Browse Jobs</Link>
            
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">Dashboard</Link>
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-300 mr-4 font-medium">{user?.name} ({user?.role})</span>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center text-sm font-medium transition duration-150">
                    <LogOut className="h-4 w-4 mr-1.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">Login</Link>
                <Link to="/register" className="bg-[#F59E0B] text-white hover:bg-yellow-600 px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
