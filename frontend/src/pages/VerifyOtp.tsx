import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const email = queryParams.get('email');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) return;

    try {
      await axios.post('http://localhost:5000/api/auth/verify-email', { userId, otp: finalOtp });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { userId });
      setMessage('A new code has been sent to your email.');
      setError('');
      setTimeLeft(600);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  if (!userId) {
    return <div className="text-center mt-20 text-red-600 font-bold">Invalid session. Please register again.</div>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
          We've sent a 6-digit verification code to <span className="font-bold text-[#1A2B4A]">{email || 'your email'}</span>. Please check your inbox.
        </p>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">{error}</div>}
        {message && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-bold border border-green-100">{message}</div>}
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold rounded-lg border border-gray-300 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B] transition"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <button type="submit" className="w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-extrabold text-white bg-[#F59E0B] hover:bg-[#D97706] transition mt-6">
            Verify OTP
          </button>
        </form>

        <div className="mt-8 text-sm font-medium">
          <div className="text-gray-500 mb-2">OTP expires in <span className="font-bold text-[#1A2B4A]">{formatTime(timeLeft)}</span></div>
          <span className="text-gray-500">Didn't receive the OTP? </span>
          <button 
            type="button" 
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`font-extrabold transition px-1 underline ${timeLeft > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#F59E0B] hover:text-[#D97706]'}`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
