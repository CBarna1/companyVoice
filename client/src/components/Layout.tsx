import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { logoutUser } from '../services/api';
import { LogOut, BarChart3, Trophy, Plus, Home, Menu, X } from 'lucide-react';
import { Avatar } from './Avatar';
import { useState } from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/feed')}>
                CompanyVoice
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex gap-6">
                <button
                  onClick={() => navigate('/feed')}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Home size={20} />
                  Feed
                </button>
                <button
                  onClick={() => navigate('/submit')}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Plus size={20} />
                  Submit
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Trophy size={20} />
                  Leaderboard
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
                  >
                    <BarChart3 size={20} />
                    Admin
                  </button>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-600">{user.xp} XP • {user.tier}</p>
              </div>
              <Avatar name={user.name} tier={user.tier} size="md" />
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-4">
              <button
                onClick={() => {
                  navigate('/feed');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Feed
              </button>
              <button
                onClick={() => {
                  navigate('/submit');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  navigate('/leaderboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Leaderboard
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 CompanyVoice - Gamified Employee Feedback Platform</p>
        </div>
      </footer>
    </div>
  );
};
