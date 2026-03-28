import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        India's Trusted <span className="text-blue-600">Freelance Ecosystem</span>
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
        KaryaSeva connects top talent with visionary clients. Featuring Smart Escrow, GST Invoicing, and AI-powered Trust Scores for a secure, low-fee experience.
      </p>
      
      <div className="flex justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
        <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link to="/jobs" className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg shadow-sm transition flex items-center justify-center">
          Browse Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Escrow Protection</h3>
          <p className="text-gray-600">Payments are held securely in milestones and released only when work is approved. Zero risk.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Trust System</h3>
          <p className="text-gray-600">Verified profiles and dynamic trust scores ensure you're working with the best platform users.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">GST Compliant</h3>
          <p className="text-gray-600">Built for India. Generate valid GST invoices automatically for seamless accounting.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
