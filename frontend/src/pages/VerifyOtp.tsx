import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const email = queryParams.get('email');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-email', { userId, otp });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { userId });
      setMessage('A new code has been sent to your email.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  if (!userId) {
    return <div className="text-center mt-20 text-red-600 font-bold">Invalid session. Please register again.</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow border border-gray-100 max-w-[480px] w-full text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <ShieldCheck className="h-10 w-10 text-[#10B981]" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1A2B4A] mb-2">Verify Your Email</h2>
        <p className="text-gray-500 text-sm font-medium mb-8">
          We've sent a 6-digit verification code to <span className="font-bold text-[#1A2B4A]">{email || 'your email'}</span>.
        </p>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">{error}</div>}
        {message && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-bold border border-green-100">{message}</div>}
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input 
              type="text" required maxLength={6}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] py-4 transition"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <button type="submit" className="w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-extrabold text-white bg-[#1A2B4A] hover:bg-[#111C33] transition mt-6">
            Verify Email
          </button>
        </form>

        <div className="mt-8 text-sm font-medium">
          <span className="text-gray-500">Didn't receive the code? </span>
          <button 
            type="button" 
            onClick={handleResend}
            className="text-[#F59E0B] hover:text-[#D97706] font-extrabold transition px-1 underline"
          >
            Resend it
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
