export const getTierColor = (tier?: string) => {
  switch (tier) {
    case 'Innovator':
      return 'bg-yellow-500';
    case 'Champion':
      return 'bg-purple-500';
    case 'Contributor':
      return 'bg-blue-500';
    case 'Newcomer':
    default:
      return 'bg-gray-500';
  }
};

export const getTierProgressPercentage = (xp: number) => {
  const tiers = [
    { name: 'Newcomer', min: 0, max: 99 },
    { name: 'Contributor', min: 100, max: 299 },
    { name: 'Champion', min: 300, max: 699 },
    { name: 'Innovator', min: 700, max: 9999 },
  ];

  for (const tier of tiers) {
    if (xp >= tier.min && xp <= tier.max) {
      const tierXP = xp - tier.min;
      const tierMax = tier.max - tier.min + 1;
      return (tierXP / tierMax) * 100;
    }
  }

  return 100;
};

export const getCurrentTier = (xp: number): string => {
  if (xp >= 700) return 'Innovator';
  if (xp >= 300) return 'Champion';
  if (xp >= 100) return 'Contributor';
  return 'Newcomer';
};
