import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'https://social-media-app-1-0wkt.onrender.com';

interface Post {
  id: number;
  content: string;
  like_count: number;
  is_liked: boolean;
  user_id: number;
  created_at: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.post(`${API_URL}/api/posts`, 
        { content: newPost },
        { headers }
      );
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleLike = async (postId: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        { headers }
      );
      setPosts(posts.map((post: Post) => {
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const fetchPosts = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${API_URL}/api/posts/feed`, { headers });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SocioNetwork</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <form onSubmit={createPost} className="mb-8 bg-white rounded-lg shadow p-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's on your mind?"
          rows={3}
        />
        <button 
          type="submit"
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Post
        </button>
      </form>

      <div className="space-y-6">
        {posts.map((post: Post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-800 mb-3">{post.content}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition ${
                  post.is_liked 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{post.is_liked ? '❤️' : '🤍'}</span>
                <span>{post.like_count}</span>
              </button>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;