import { User } from '../models';

export enum XPRewards {
  CHALLENGE_POST = 50,
  SOLUTION_POST = 80,
  CHALLENGE_SOLUTION_POST = 120,
  RECEIVE_UPVOTE = 20,
  RESOLVED_SOLUTION = 150,
  COMMENT = 30,
}

export interface UserTier {
  name: 'Newcomer' | 'Contributor' | 'Champion' | 'Innovator';
  minXP: number;
  maxXP: number;
}

export const TIERS: UserTier[] = [
  { name: 'Newcomer', minXP: 0, maxXP: 99 },
  { name: 'Contributor', minXP: 100, maxXP: 299 },
  { name: 'Champion', minXP: 300, maxXP: 699 },
  { name: 'Innovator', minXP: 700, maxXP: Infinity },
];

export const calculateTier = (xp: number): 'Newcomer' | 'Contributor' | 'Champion' | 'Innovator' => {
  for (const tier of TIERS) {
    if (xp >= tier.minXP && xp <= tier.maxXP) {
      return tier.name;
    }
  }
  return 'Newcomer';
};

export const awardXP = async (userId: number, amount: number, reason: string): Promise<void> => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const newXP = (user.xp || 0) + amount;
  const newTier = calculateTier(newXP);

  await user.update({
    xp: newXP,
    tier: newTier,
  });

  console.log(`${reason}: User ${userId} gained ${amount} XP (Total: ${newXP}, Tier: ${newTier})`);
};

export const getXPForPostType = (postType: 'challenge' | 'solution' | 'both'): number => {
  switch (postType) {
    case 'challenge':
      return XPRewards.CHALLENGE_POST;
    case 'solution':
      return XPRewards.SOLUTION_POST;
    case 'both':
      return XPRewards.CHALLENGE_SOLUTION_POST;
    default:
      return 0;
  }
};
