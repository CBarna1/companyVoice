import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminSettings, updateAdminSettings, getAllAdminPosts, exportPostsCSV } from '../services/api';
import { useAuth } from '../services/authContext';
import { BarChart3, Settings, Download } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anonymityEnabled, setAnonymityEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, settingsRes, postsRes] = await Promise.all([
        getAdminStats(),
        getAdminSettings(),
        getAllAdminPosts(),
      ]);
      setStats(statsRes.data);
      setSettings(settingsRes.data);
      setAnonymityEnabled(settingsRes.data.anonymity_enabled === 'true');
      setPosts(postsRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymityToggle = async (enabled: boolean) => {
    try {
      setUpdating(true);
      await updateAdminSettings({ anonymity_enabled: enabled });
      setAnonymityEnabled(enabled);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportPostsCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posts-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      setError('Failed to export posts');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-800 text-lg font-semibold">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <BarChart3 size={32} />
          Admin Dashboard
        </h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading admin data...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Posts', value: stats?.totalPosts, color: 'blue' },
                { label: 'Challenges', value: stats?.totalChallenges, color: 'red' },
                { label: 'Solutions', value: stats?.totalSolutions, color: 'green' },
                { label: 'Active Users', value: stats?.activeUsers, color: 'purple' },
              ].map((stat) => (
                <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}>
                  <p className={`text-${stat.color}-600 text-sm font-semibold`}>{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-700 mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Settings size={24} />
                Platform Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">Anonymous Posts</p>
                    <p className="text-sm text-gray-600">
                      {anonymityEnabled
                        ? 'Users can post anonymously (even admins cannot see author)'
                        : 'Anonymous posts show as "Anonymous" (admins can see author)'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAnonymityToggle(!anonymityEnabled)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      anonymityEnabled
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    } disabled:opacity-50`}
                  >
                    {updating ? 'Updating...' : anonymityEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>

            {/* Export */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Download size={24} />
                Export Data
              </h2>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Export Posts to CSV
              </button>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">All Posts</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Author</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Votes</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{post.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{post.author}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                            {post.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{post.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          👍 {post.upvotes} 👎 {post.downvotes}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
