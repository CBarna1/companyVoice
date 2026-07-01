import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import { useAuth } from '../services/authContext';
import { getXPForPostType } from '../utils/xpUtils';
import { ArrowRight } from 'lucide-react';

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [type, setType] = useState<'challenge' | 'solution' | 'both'>('challenge');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [tags, setTags] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = ['Engineering', 'HR', 'Marketing', 'Operations', 'Finance', 'Sales'];
  const xpReward = getXPForPostType(type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await createPost({
        type,
        title,
        body,
        department,
        tags: tagArray,
        is_anonymous: isAnonymous,
      });

      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Post</h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Post Type</label>
              <div className="grid grid-cols-3 gap-4">
                {(['challenge', 'solution', 'both'] as const).map((postType) => (
                  <button
                    key={postType}
                    type="button"
                    onClick={() => setType(postType)}
                    className={`p-4 rounded-lg border-2 transition ${
                      type === postType
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 capitalize">{postType}</div>
                    <div className="text-xs text-gray-600 mt-1">+{getXPForPostType(postType)} XP</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your post about?"
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide details about your post..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Separate tags with commas (e.g. performance, backend, urgent)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Add relevant tags to help others find your post</p>
            </div>

            {/* Anonymity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">Post anonymously</span>
              </label>
              <p className="text-xs text-gray-600 mt-2">Your identity will be hidden from other employees (admins can still see)</p>
            </div>

            {/* XP Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">You'll earn</p>
                  <p className="text-2xl font-bold text-blue-600">{xpReward} XP</p>
                  <p className="text-xs text-gray-600 mt-1">for posting this {type}</p>
                </div>
                <ArrowRight size={24} className="text-blue-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/feed')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title || !body}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
