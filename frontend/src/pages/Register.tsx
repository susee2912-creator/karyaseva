import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '', role: 'client' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate(`/verify-otp?userId=${res.data._id}&email=${formData.email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Create your Account
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Join India's most trusted freelancing platform.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Full Name</label>
            <input 
              type="text" required
              className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Rahul Kumar"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" required
              className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Mobile Number</label>
            <input 
              type="text" required
              className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              placeholder="+91 9876543210"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Password</label>
              <input 
                type="password" required minLength={6}
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A2B4A] mb-1.5 uppercase tracking-wide">Confirm</label>
              <input 
                type="password" required minLength={6}
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-3 transition font-medium"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 text-center uppercase tracking-wider">I want to join as a</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'client'})}
                className={`flex-1 py-3 rounded-lg text-sm font-extrabold transition-all border-2 ${
                  formData.role === 'client' 
                    ? 'border-[#F59E0B] bg-[#F59E0B] text-white shadow-md' 
                    : 'border-gray-200 text-gray-500 hover:border-[#1A2B4A]'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'freelancer'})}
                className={`flex-1 py-3 rounded-lg text-sm font-extrabold transition-all border-2 ${
                  formData.role === 'freelancer' 
                    ? 'border-[#F59E0B] bg-[#F59E0B] text-white shadow-md' 
                    : 'border-gray-200 text-gray-500 hover:border-[#1A2B4A]'
                }`}
              >
                Freelancer
              </button>
            </div>
          </div>

          <button type="submit" className="w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-[16px] font-extrabold text-white bg-[#F59E0B] hover:bg-[#D97706] transition mt-6 flex items-center">
            Register Account
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-xs font-bold text-gray-400 uppercase">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        
        <div className="text-center text-sm font-medium">
          <span className="text-gray-500">Already have an account? </span>
          <Link to="/login" className="text-[#F59E0B] hover:text-[#D97706] font-extrabold transition px-1">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
