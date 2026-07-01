export const getXPForPostType = (postType: 'challenge' | 'solution' | 'both'): number => {
  switch (postType) {
    case 'challenge':
      return 50;
    case 'solution':
      return 80;
    case 'both':
      return 120;
    default:
      return 0;
  }
};

export const XP_REWARDS = {
  CHALLENGE_POST: 50,
  SOLUTION_POST: 80,
  CHALLENGE_SOLUTION_POST: 120,
  RECEIVE_UPVOTE: 20,
  RESOLVED_SOLUTION: 150,
  COMMENT: 30,
};
