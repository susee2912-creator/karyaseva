import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, FileText } from 'lucide-react';

const KYC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else if (user.verified) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a document to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('idDocument', file);
    formData.append('userId', user._id || user.id);

    try {
      await axios.post('http://localhost:5000/api/auth/upload-id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local storage user object
      const updatedUser = { ...user, verified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Navigate to dashboard
      navigate('/dashboard');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow border border-gray-100 max-w-[500px] w-full text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="bg-orange-100 p-4 rounded-full">
            <Shield className="h-10 w-10 text-[#F59E0B]" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1A2B4A] mb-2">Complete Your KYC Verification</h2>
        <p className="text-gray-500 text-sm font-medium mb-8">
          Upload a valid government-issued ID (Aadhaar or PAN) to secure your account and gain full access to the platform.
        </p>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">{error}</div>}
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#F59E0B] transition cursor-pointer relative bg-gray-50">
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-12 h-12 text-[#10B981] mb-3" />
                <span className="font-bold text-[#1A2B4A] text-sm">{file.name}</span>
                <span className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="font-bold text-gray-600 text-sm">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-extrabold text-white transition mt-6 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A2B4A] hover:bg-[#111C33]'}`}
          >
            {loading ? 'Processing Document...' : 'Submit Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYC;
