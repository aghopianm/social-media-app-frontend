import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'https://social-media-app-1-0wkt.onrender.com';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password?.length
      });

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      });

      console.log('Server response:', {
        status: response.status,
        data: response.data
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token saved, navigating to feed');
        navigate('/feed');
      }
    } catch (error: any) {
      console.error('Login attempt failed:', {
        status: error.response?.status,
        data: error.response?.data,
        error: error.message
      });

      if (error.response?.status === 401) {
        alert('Invalid username/email or password. Please try again.');
      } else {
        alert('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex items-center justify-between">
        <div className="flex-1 pr-12">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">SocioNetwork</h1>
          <p className="text-2xl text-gray-700 max-w-md">
            The social network you remember
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                autoComplete="username"
                required
                placeholder="Email or username"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </div>

            <div className="text-center">
              <Link to="#" className="text-blue-600 hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            <div className="border-t border-gray-300 pt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create new account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
