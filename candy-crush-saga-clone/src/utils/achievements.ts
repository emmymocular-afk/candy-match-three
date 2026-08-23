import { Achievement, PlayerProgress } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'jelly-100',
    title: 'Jelly Crusher',
    description: 'Clear 100 jellies across all levels',
    badgeEmoji: '🧊',
    category: 'jelly',
    targetValue: 100,
    reward: {
      coins: 300,
      boosters: { hammer: 1 },
    },
  },
  {
    id: 'jelly-250',
    title: 'Jelly Master',
    description: 'Clear 250 jellies across all levels',
    badgeEmoji: '👑',
    category: 'jelly',
    targetValue: 250,
    reward: {
      coins: 600,
      boosters: { hammer: 2 },
    },
  },
  {
    id: 'score-50k',
    title: 'Sugar Legend',
    description: 'Reach a cumulative score of 50,000 points',
    badgeEmoji: '✨',
    category: 'score',
    targetValue: 50000,
    reward: {
      coins: 500,
      boosters: { freeSwap: 1 },
    },
  },
  {
    id: 'score-10k',
    title: 'Sweet Scorer',
    description: 'Reach a cumulative score of 10,000 points',
    badgeEmoji: '🎯',
    category: 'score',
    targetValue: 10000,
    reward: {
      coins: 150,
    },
  },
  {
    id: 'stars-15',
    title: 'Star Struck',
    description: 'Accumulate 15 stars on the level map',
    badgeEmoji: '⭐',
    category: 'stars',
    targetValue: 15,
    reward: {
      coins: 250,
      boosters: { extraMoves: 1 },
    },
  },
  {
    id: 'stars-30',
    title: 'Galaxy Crusher',
    description: 'Accumulate 30 stars on the level map',
    badgeEmoji: '🌟',
    category: 'stars',
    targetValue: 30,
    reward: {
      coins: 500,
      boosters: { colorBombStart: 1 },
    },
  },
  {
    id: 'level-5',
    title: 'World Explorer',
    description: 'Reach or complete Level 5',
    badgeEmoji: '🗺️',
    category: 'level',
    targetValue: 5,
    reward: {
      coins: 200,
    },
  },
  {
    id: 'level-10',
    title: 'Saga Champion',
    description: 'Reach or complete Level 10',
    badgeEmoji: '🏆',
    category: 'level',
    targetValue: 10,
    reward: {
      coins: 500,
      boosters: { colorBombStart: 1, stripedStart: 1 },
    },
  },
  {
    id: 'special-25',
    title: 'Sugar Bomb Specialist',
    description: 'Match or trigger 25 special candies',
    badgeEmoji: '💣',
    category: 'special',
    targetValue: 25,
    reward: {
      coins: 250,
      boosters: { stripedStart: 1 },
    },
  },
  {
    id: 'spin-3',
    title: 'Lucky Wheel Fan',
    description: 'Spin the Daily Wheel 3 times',
    badgeEmoji: '🎡',
    category: 'spin',
    targetValue: 3,
    reward: {
      coins: 200,
    },
  },
];

/**
 * Helper to compute current progress for an achievement based on player state/stats.
 */
export function getAchievementProgress(achievement: Achievement, progress: PlayerProgress): number {
  const stats = progress.stats || {
    totalJelliesCleared: 0,
    totalScore: 0,
    levelsCompleted: 0,
    totalStars: 0,
    totalSpecialCandies: 0,
    totalSpins: 0,
  };

  switch (achievement.category) {
    case 'jelly':
      return stats.totalJelliesCleared || 0;
    case 'score':
      return stats.totalScore || 0;
    case 'level':
      return Math.max(stats.levelsCompleted || 0, progress.unlockedLevel - 1);
    case 'stars': {
      const totalStars = Object.values(progress.stars || {}).reduce((acc: number, curr: number) => acc + curr, 0);
      return Math.max(stats.totalStars || 0, totalStars);
    }
    case 'special':
      return stats.totalSpecialCandies || 0;
    case 'spin':
      return stats.totalSpins || 0;
    default:
      return 0;
  }
}

export function isAchievementCompleted(achievement: Achievement, progress: PlayerProgress): boolean {
  const currentVal = getAchievementProgress(achievement, progress);
  return currentVal >= achievement.targetValue;
}

export function isAchievementClaimed(achievementId: string, progress: PlayerProgress): boolean {
  return !!progress.claimedAchievements?.[achievementId];
}

export function hasUnclaimedAchievements(progress: PlayerProgress): boolean {
  return ACHIEVEMENTS.some(
    (ach) => isAchievementCompleted(ach, progress) && !isAchievementClaimed(ach.id, progress)
  );
}

export function claimAchievementReward(achievementId: string, progress: PlayerProgress): {
  updatedProgress: PlayerProgress;
  reward: Achievement['reward'];
  achievement: Achievement;
} | null {
  const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!ach) return null;

  if (!isAchievementCompleted(ach, progress) || isAchievementClaimed(achievementId, progress)) {
    return null;
  }

  const newClaimed = {
    ...(progress.claimedAchievements || {}),
    [achievementId]: true,
  };

  const newBoosters = { ...progress.boosters };
  if (ach.reward.boosters) {
    if (ach.reward.boosters.hammer) newBoosters.hammer += ach.reward.boosters.hammer;
    if (ach.reward.boosters.freeSwap) newBoosters.freeSwap += ach.reward.boosters.freeSwap;
    if (ach.reward.boosters.colorBombStart) newBoosters.colorBombStart += ach.reward.boosters.colorBombStart;
    if (ach.reward.boosters.stripedStart) newBoosters.stripedStart += ach.reward.boosters.stripedStart;
    if (ach.reward.boosters.extraMoves) newBoosters.extraMoves += ach.reward.boosters.extraMoves;
  }

  const updatedProgress: PlayerProgress = {
    ...progress,
    coins: progress.coins + ach.reward.coins,
    boosters: newBoosters,
    claimedAchievements: newClaimed,
  };

  return {
    updatedProgress,
    reward: ach.reward,
    achievement: ach,
  };
}
