import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://social-media-app-1-0wkt.onrender.com';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending registration data:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      const response = await axios.post(`${API_URL}/api/auth/register`, formData);
      console.log('Registration response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/feed');
    } catch (error: any) {
      console.error('Registration error details:', error.response?.data);
      alert(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[#1877f2] text-5xl font-bold mb-4">facebook</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Create a new account</h2>
          <p className="text-gray-600 mt-2">It's quick and easy.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              className="w-full bg-[#42b72a] text-white py-3 rounded-lg font-semibold text-xl hover:bg-[#36a420] transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/"
              className="text-[#1877f2] hover:underline"
            >
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;