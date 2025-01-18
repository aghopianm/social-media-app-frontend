import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://social-media-app-1-0wkt.onrender.com';

interface Post {
  id: number;
  content: string;
  author_username: string;
  full_name: string;
  created_at: string;
  like_count: number;
  is_liked?: boolean;
}

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  // Use useCallback to memoize the fetchPosts function
  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate]); // Include navigate in dependencies

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Now fetchPosts is stable and can be included

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/posts`, { content: newPost });
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/like`);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1,
            is_liked: !post.is_liked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-[#1877f2] text-3xl font-bold">facebook</h1>
            <div className="flex space-x-4">
              <button 
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto pt-20 px-4 pb-8">
        {/* Create Post */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <form onSubmit={createPost}>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50"
                placeholder="What's on your mind?"
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1877f2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#166fe5] transition-colors"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold">
                    {post.full_name[0].toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{post.full_name}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="border-t pt-3 flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      post.is_liked ? 'text-[#1877f2]' : 'text-gray-600'
                    }`}
                  >
                    <svg 
                      className="w-5 h-5"
                      fill={post.is_liked ? 'currentColor' : 'none'}
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>{post.like_count} {post.like_count === 1 ? 'Like' : 'Likes'}</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;