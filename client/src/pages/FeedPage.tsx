import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/api';
import { PostCard } from '../components/PostCard';
import { Plus, Filter } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState<string>('all');
  const [department, setDepartment] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [type, department, page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const typeFilter = type === 'all' ? undefined : type;
      const response = await getPosts(typeFilter, department, undefined, undefined, page, 20);
      setPosts(response.data.data);
      setTotalPages(Math.ceil(response.data.total / response.data.limit));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Operations', 'Finance', 'Sales'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Feed</h1>
            <button
              onClick={() => navigate('/submit')}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Plus size={20} />
              New Post
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Filter size={20} />
              <span>Filter posts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Posts</option>
                  <option value="challenge">Challenges</option>
                  <option value="solution">Solutions</option>
                  <option value="both">Challenge + Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setType('all');
                    setDepartment('');
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No posts found</div>
          ) : (
            <div className="grid gap-4 mb-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  {...post}
                  onClick={() => navigate(`/posts/${post.id}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    page === p ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
