import React from 'react';
import { getTierColor } from '../utils/tierUtils';

interface Props {
  name?: string;
  tier?: string;
  anonymous?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<Props> = ({ name = 'Anonymous', tier = 'Newcomer', anonymous = false, size = 'md' }) => {
  const initials = anonymous ? 'A' : (name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = getTierColor(tier);

  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  );
};
