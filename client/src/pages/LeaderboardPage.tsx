import React, { useState, useEffect } from 'react';
import { getTopContributors, getTopSolvers } from '../services/api';
import { Avatar } from '../components/Avatar';
import { TierBadge } from '../components/TierBadge';
import { Trophy, Target } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [contributors, setContributors] = useState<any[]>([]);
  const [solvers, setSolvers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'contributors' | 'solvers'>('contributors');

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      const [contributorsRes, solversRes] = await Promise.all([
        getTopContributors(50),
        getTopSolvers(50),
      ]);
      setContributors(contributorsRes.data);
      setSolvers(solversRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Trophy size={32} className="text-yellow-500" />
            Leaderboard
          </h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('contributors')}
              className={`pb-2 px-4 font-semibold transition ${
                activeTab === 'contributors'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌟 Top Contributors
            </button>
            <button
              onClick={() => setActiveTab('solvers')}
              className={`pb-2 px-4 font-semibold transition ${
                activeTab === 'solvers'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target size={20} className="inline mr-1" /> Top Solvers
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading leaderboard...</div>
          ) : (
            <>
              {activeTab === 'contributors' && (
                <div className="space-y-2">
                  {contributors.map((user, index) => (
                    <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg ${index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'}`}>
                      <span className="text-2xl w-8">{getMedalEmoji(user.rank)}</span>
                      <span className="font-bold text-gray-700 w-8">#{user.rank}</span>
                      <Avatar name={user.name} tier={user.tier} size="md" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <TierBadge tier={user.tier} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{user.xp}</p>
                        <p className="text-xs text-gray-600">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'solvers' && (
                <div className="space-y-2">
                  {solvers.map((user, index) => (
                    <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg ${index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'}`}>
                      <span className="text-2xl w-8">{getMedalEmoji(user.rank)}</span>
                      <span className="font-bold text-gray-700 w-8">#{user.rank}</span>
                      <Avatar name={user.name} tier={user.tier} size="md" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <TierBadge tier={user.tier} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{user.resolved_solutions}</p>
                        <p className="text-xs text-gray-600">Solutions</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
