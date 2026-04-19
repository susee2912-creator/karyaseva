import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import EscrowPayment from './pages/EscrowPayment';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import RatingReview from './pages/RatingReview';

import VerifyOtp from './pages/VerifyOtp';
import KYC from './pages/KYC';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F0F4F8] text-[#1A2B4A] font-sans">
        <Navbar />
        <main className="w-full flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/escrow/:jobId" element={<EscrowPayment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/review/:jobId" element={<RatingReview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
