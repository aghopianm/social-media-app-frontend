import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'https://social-media-app-1-0wkt.onrender.com';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/feed');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center max-w-4xl w-full">
        {/* Left side - Facebook branding */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-[#1877f2] text-6xl font-bold mb-4">facebook</h1>
          <p className="text-2xl text-gray-700">
            Connect with friends and the world around you on Facebook Clone.
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="md:w-1/2 w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white py-3 rounded-lg font-semibold text-xl hover:bg-[#166fe5] transition-colors"
              >
                Log In
              </button>
            </form>
            
            <div className="mt-4 pt-4 border-t text-center">
              <Link 
                to="/register"
                className="inline-block bg-[#42b72a] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#36a420] transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
