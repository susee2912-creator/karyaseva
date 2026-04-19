import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, FileText, Percent, CheckCircle, Briefcase, User, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1A2B4A] py-[60px] text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute top-[-20%] left-[-5%] text-[300px] font-extrabold text-white opacity-[0.03] transform -rotate-12 select-none pointer-events-none tracking-tighter leading-none z-0">
          INDIA
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-[38px] font-bold tracking-tight mb-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="text-white">India's Most Trusted</span>
          <span className="text-[#F59E0B]">Freelancing Platform</span>
        </h1>
        <p className="text-[14px] text-gray-400 max-w-[500px] mx-auto mb-8">
          Secure, transparent, and built for Indians. Experience AI-driven trust scoring, blockchain-verified work, and seamless UPI escrow payments.
        </p>
        <div className="flex justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="bg-[#F59E0B] text-white hover:bg-[#D97706] font-bold py-3 px-6 rounded-lg shadow-md transition text-sm">
            Get Started
          </Link>
          <Link to="/login" className="bg-transparent text-white border border-white/30 hover:border-white font-bold py-3 px-6 rounded-lg transition text-sm">
            Login
          </Link>
        </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#F0F4F8] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A2B4A] text-center mb-12">Why Choose KaryaSeva?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-[#1A2B4A] mb-2">Escrow Payments</h3>
              <p className="text-gray-500 text-sm">Your money is held securely until work is approved</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-[#1A2B4A] mb-2">AI Trust Score</h3>
              <p className="text-gray-500 text-sm">Smart scoring system to identify reliable users</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-[#1A2B4A] mb-2">GST Invoices</h3>
              <p className="text-gray-500 text-sm">Auto-generated GST invoices for every transaction</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Percent className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A2B4A] mb-2">Only 5% Fee</h3>
              <p className="text-gray-500 text-sm">Industry lowest platform fee for Indian freelancers</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-[#1A2B4A] mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-gray-200 z-0"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md border-4 border-white">1</div>
              <h3 className="text-xl font-bold text-[#1A2B4A] mb-3">Register & Verify</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Create your account and complete KYC verification with your Aadhaar or PAN</p>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md border-4 border-white">2</div>
              <h3 className="text-xl font-bold text-[#1A2B4A] mb-3">Post or Find Jobs</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Clients post jobs with milestones. Freelancers browse and apply with proposals</p>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md border-4 border-white">3</div>
              <h3 className="text-xl font-bold text-[#1A2B4A] mb-3">Get Paid Securely</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Work is verified via blockchain proof. Payment released through secure escrow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="bg-[#1A2B4A] py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-white text-4xl font-bold mb-2">10,000+</p>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Registered Users</p>
          </div>
          <div>
            <p className="text-white text-4xl font-bold mb-2">5,000+</p>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Jobs Posted</p>
          </div>
          <div>
            <p className="text-white text-4xl font-bold mb-2">₹2 Crore+</p>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Payments Processed</p>
          </div>
          <div>
            <p className="text-white text-4xl font-bold mb-2">4.8 / 5</p>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </section>

      {/* For Clients and Freelancers Section */}
      <section className="bg-[#F0F4F8] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="mb-6 bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A2B4A] mb-6">For Clients</h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Post jobs with milestone payments</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Hire verified freelancers</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Pay securely via escrow</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Auto GST invoices</li>
            </ul>
            <Link to="/register" className="inline-block text-center bg-[#F59E0B] text-white hover:bg-[#D97706] font-bold py-3.5 px-6 rounded-lg transition">
              Post a Job
            </Link>
          </div>
          
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="mb-6 bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A2B4A] mb-6">For Freelancers</h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Browse jobs with risk meter</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Apply with proposals</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Get paid per milestone</li>
              <li className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" /> Build your trust score</li>
            </ul>
            <Link to="/register" className="inline-block text-center bg-[#F59E0B] text-white hover:bg-[#D97706] font-bold py-3.5 px-6 rounded-lg transition">
              Find Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A2B4A] text-center mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow border border-gray-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 font-bold text-xl rounded-full flex items-center justify-center mb-4">RK</div>
              <h4 className="font-bold text-[#1A2B4A]">Rajesh K.</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Client</p>
              <div className="flex items-center justify-center mb-4 space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"/>)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">"KaryaSeva made hiring freelancers so easy. The escrow system gave me full confidence."</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow border border-gray-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-700 font-bold text-xl rounded-full flex items-center justify-center mb-4">PM</div>
              <h4 className="font-bold text-[#1A2B4A]">Priya M.</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Freelancer</p>
              <div className="flex items-center justify-center mb-4 space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"/>)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">"Finally a platform that understands Indian freelancers. Got paid on time every time."</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow border border-gray-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-700 font-bold text-xl rounded-full flex items-center justify-center mb-4">AS</div>
              <h4 className="font-bold text-[#1A2B4A]">Arjun S.</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Freelancer</p>
              <div className="flex items-center justify-center mb-4 space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"/>)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">"The trust score and risk meter helped me find genuine clients. Highly recommended."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2B4A] pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-white/10 gap-8 md:gap-0">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Briefcase className="h-6 w-6 text-white mr-2" />
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Karya</span>
                <span className="text-[#F59E0B]">Seva</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs">India's Most Trusted Freelancing Platform</p>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
          
          <div className="flex flex-col text-sm text-gray-300 md:text-right">
            <a href="mailto:support@karyaseva.in" className="hover:text-white transition mb-1">support@karyaseva.in</a>
            <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest">India First Platform</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          KaryaSeva © 2025 · India First · Secure Payments · GST Compliant · Powered by Blockchain
        </div>
      </footer>
    </div>
  );
};

export default Home;
