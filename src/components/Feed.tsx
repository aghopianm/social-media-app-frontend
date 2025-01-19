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

  // Create axios instance with auth header
  const getAxiosAuth = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug log
      
      const response = await getAxiosAuth().post(`${API_URL}/api/posts`, {
        content: newPost
      });
      
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/'); // Redirect to login if unauthorized
      }
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await getAxiosAuth().post(`${API_URL}/api/posts/${postId}/like`);
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
        navigate('/');
      }
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await getAxiosAuth().get(`${API_URL}/api/posts/feed`);
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

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={createPost} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="What's on your mind?"
        />
        <button 
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post: Post) => (
          <div key={post.id} className="border p-4 rounded">
            <p>{post.content}</p>
            <button
              onClick={() => handleLike(post.id)}
              className={`mt-2 px-3 py-1 rounded ${
                post.is_liked ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Like ({post.like_count})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;