import React from 'react';

interface Props {
  tier?: string;
}

export const TierBadge: React.FC<Props> = ({ tier = 'Newcomer' }) => {
  const tierColors: { [key: string]: string } = {
    Newcomer: 'bg-gray-100 text-gray-800',
    Contributor: 'bg-blue-100 text-blue-800',
    Champion: 'bg-purple-100 text-purple-800',
    Innovator: 'bg-yellow-100 text-yellow-800',
  };

  const tierEmojis: { [key: string]: string } = {
    Newcomer: '🌱',
    Contributor: '⭐',
    Champion: '🏆',
    Innovator: '💡',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${tierColors[tier] || tierColors.Newcomer}`}>
      {tierEmojis[tier]} {tier}
    </span>
  );
};
