import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth
export const registerUser = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

export const loginUser = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const refreshToken = () => api.post('/auth/refresh');

export const logoutUser = () => api.post('/auth/logout');

// Posts
export const getPosts = (type?: string, department?: string, status?: string, tag?: string, page?: number, limit?: number) =>
  api.get('/posts', { params: { type, department, status, tag, page, limit } });

export const getPost = (id: number) => api.get(`/posts/${id}`);

export const createPost = (data: any) => api.post('/posts', data);

export const updatePostStatus = (id: number, status: string) =>
  api.patch(`/posts/${id}/status`, { status });

export const deletePost = (id: number) => api.delete(`/posts/${id}`);

// Votes
export const votePost = (id: number, direction: 'up' | 'down') =>
  api.post(`/posts/${id}/vote`, { direction });

// Comments
export const getComments = (id: number) => api.get(`/posts/${id}/comments`);

export const addComment = (id: number, body: string, is_anonymous: boolean) =>
  api.post(`/posts/${id}/comments`, { body, is_anonymous });

// Leaderboard
export const getTopContributors = (limit?: number) =>
  api.get('/leaderboard/contributors', { params: { limit } });

export const getTopSolvers = (limit?: number) =>
  api.get('/leaderboard/solvers', { params: { limit } });

// Admin
export const getAdminStats = () => api.get('/admin/stats');

export const getAdminSettings = () => api.get('/admin/settings');

export const updateAdminSettings = (data: any) => api.patch('/admin/settings', data);

export const getAllAdminPosts = (page?: number, limit?: number) =>
  api.get('/admin/posts', { params: { page, limit } });

export const exportPostsCSV = () =>
  api.get('/admin/export', { responseType: 'blob' });

export default api;
