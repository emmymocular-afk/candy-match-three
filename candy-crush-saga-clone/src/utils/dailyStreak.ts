import { DailyStreakData, DailyStreakReward } from '../types';

export const STREAK_REWARDS: DailyStreakReward[] = [
  {
    day: 1,
    title: 'Day 1 Welcome',
    coins: 100,
    icon: '🪙',
  },
  {
    day: 2,
    title: 'Day 2 Hammer Hit',
    coins: 150,
    boosters: { hammer: 1 },
    icon: '🔨',
  },
  {
    day: 3,
    title: 'Day 3 Magic Touch',
    coins: 200,
    boosters: { freeSwap: 1 },
    icon: '🖐️',
  },
  {
    day: 4,
    title: 'Day 4 Sugar Zap',
    coins: 300,
    boosters: { stripedStart: 1 },
    icon: '⚡',
  },
  {
    day: 5,
    title: 'Day 5 Rainbow Blast',
    coins: 400,
    boosters: { colorBombStart: 1 },
    icon: '🌈',
  },
  {
    day: 6,
    title: 'Day 6 Extra Moves',
    coins: 500,
    boosters: { extraMoves: 1 },
    icon: '➕',
  },
  {
    day: 7,
    title: 'Day 7 GRAND CHEST!',
    coins: 1200,
    boosters: {
      hammer: 2,
      freeSwap: 2,
      colorBombStart: 2,
      stripedStart: 2,
      extraMoves: 2,
    },
    icon: '👑',
    isMilestone: true,
  },
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface StreakInfo {
  currentStreak: number;
  highestStreak: number;
  isClaimedToday: boolean;
  canClaimToday: boolean;
  nextDayToClaim: number; // 1 to 7
  isStreakBroken: boolean;
}

export function getStreakInfo(streakData?: DailyStreakData): StreakInfo {
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  if (!streakData || !streakData.lastClaimDate) {
    return {
      currentStreak: 0,
      highestStreak: streakData?.highestStreak || 0,
      isClaimedToday: false,
      canClaimToday: true,
      nextDayToClaim: 1,
      isStreakBroken: false,
    };
  }

  const { currentStreak = 0, lastClaimDate, highestStreak = 0 } = streakData;

  if (lastClaimDate === todayStr) {
    // Already claimed today
    const currentDayInCycle = ((currentStreak - 1) % 7) + 1;
    return {
      currentStreak,
      highestStreak: Math.max(highestStreak, currentStreak),
      isClaimedToday: true,
      canClaimToday: false,
      nextDayToClaim: (currentDayInCycle % 7) + 1,
      isStreakBroken: false,
    };
  }

  if (lastClaimDate === yesterdayStr) {
    // Streak continues! Player can claim today's reward
    const nextDayInCycle = (currentStreak % 7) + 1;
    return {
      currentStreak,
      highestStreak: Math.max(highestStreak, currentStreak),
      isClaimedToday: false,
      canClaimToday: true,
      nextDayToClaim: nextDayInCycle,
      isStreakBroken: false,
    };
  }

  // Streak broken! Missed at least one day
  return {
    currentStreak: 0,
    highestStreak,
    isClaimedToday: false,
    canClaimToday: true,
    nextDayToClaim: 1,
    isStreakBroken: true,
  };
}

export function claimDailyStreakReward(streakData?: DailyStreakData): {
  updatedStreakData: DailyStreakData;
  rewardClaimed: DailyStreakReward;
  newStreakCount: number;
} {
  const todayStr = getTodayDateString();
  const info = getStreakInfo(streakData);

  if (!info.canClaimToday) {
    // Edge case safety
    const dayReward = STREAK_REWARDS[info.nextDayToClaim - 1];
    return {
      updatedStreakData: streakData || { currentStreak: 0, lastClaimDate: todayStr, highestStreak: 0 },
      rewardClaimed: dayReward,
      newStreakCount: info.currentStreak,
    };
  }

  const newStreakCount = info.isStreakBroken ? 1 : info.currentStreak + 1;
  const dayIndexInCycle = ((newStreakCount - 1) % 7) + 1; // 1 to 7
  const rewardClaimed = STREAK_REWARDS[dayIndexInCycle - 1];

  const newHighest = Math.max(streakData?.highestStreak || 0, newStreakCount);

  const updatedStreakData: DailyStreakData = {
    currentStreak: newStreakCount,
    lastClaimDate: todayStr,
    highestStreak: newHighest,
  };

  return {
    updatedStreakData,
    rewardClaimed,
    newStreakCount,
  };
}
