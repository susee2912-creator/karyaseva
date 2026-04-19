import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (!res.data.user.verified) {
        navigate('/kyc');
      } else {
        navigate('/dashboard');
      }
      window.location.reload(); 
    } catch (err: any) {
      if (err.response?.data?.code === 'unverified_email') {
        const userId = err.response.data.userId;
        navigate(`/verify-otp?userId=${userId}&email=${email}`);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F4F8]">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100 max-w-[480px] w-full">
        
        {/* Logo Section inside card */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center mb-2">
            <div className="bg-[#1A2B4A] p-2 rounded-lg mr-3 shadow-md">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#1A2B4A]">Karya</span>
              <span className="text-[#F59E0B]">Seva</span>
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-[#10B981] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            India First
          </span>
        </div>

        <div className="text-center mb-8 border-t border-gray-100 pt-4 mt-2">
          <h2 className="text-2xl font-extrabold text-[#1A2B4A]">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Login to your KaryaSeva account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" required
              className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-[16px] font-extrabold text-white bg-[#F59E0B] hover:bg-[#D97706] transition mt-8 flex items-center">
            Login
          </button>
          
          <div className="text-center mt-3">
             <span className="text-xs font-bold text-gray-400 hover:text-[#1A2B4A] cursor-pointer transition uppercase tracking-wide">Forgot Password?</span>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-xs font-bold text-gray-400 uppercase">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        
        <div className="text-center text-sm font-medium">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-[#F59E0B] hover:text-[#D97706] font-extrabold transition px-1">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
