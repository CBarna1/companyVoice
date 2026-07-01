import React from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Avatar } from './Avatar';
import { TierBadge } from './TierBadge';

interface Props {
  id: number;
  author?: { name?: string; tier?: string };
  type: string;
  title: string;
  body: string;
  department: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments?: number;
  xp_awarded: number;
  onClick?: () => void;
}

export const PostCard: React.FC<Props> = ({
  id,
  author,
  type,
  title,
  body,
  department,
  tags,
  upvotes,
  downvotes,
  comments = 0,
  xp_awarded,
  onClick,
}) => {
  const typeColors: { [key: string]: string } = {
    challenge: 'bg-red-50 border-red-200',
    solution: 'bg-green-50 border-green-200',
    both: 'bg-blue-50 border-blue-200',
  };

  const typeBadgeColors: { [key: string]: string } = {
    challenge: 'bg-red-100 text-red-800',
    solution: 'bg-green-100 text-green-800',
    both: 'bg-blue-100 text-blue-800',
  };

  const truncateBody = (text: string, length: number = 120) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div
      className={`border rounded-lg p-4 ${typeColors[type]} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${typeBadgeColors[type]}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <span className="text-sm font-semibold text-amber-600">+{xp_awarded} XP</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Avatar name={author?.name} tier={author?.tier} size="sm" />
        <div>
          <p className="font-medium text-sm">{author?.name || 'Anonymous'}</p>
          {author?.tier && <TierBadge tier={author.tier} />}
        </div>
        <span className="text-xs text-gray-600 ml-auto">{department}</span>
      </div>

      <p className="text-gray-700 text-sm mb-3">{truncateBody(body)}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
          {tags.length > 3 && <span className="text-xs text-gray-600">+{tags.length - 3} more</span>}
        </div>
      )}

      <div className="flex gap-4 text-sm text-gray-600 border-t pt-2">
        <div className="flex items-center gap-1">
          <ThumbsUp size={16} />
          <span>{upvotes}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown size={16} />
          <span>{downvotes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};
