import { DailyMission, DailyMissionType, DailyMissionsData } from '../types';

export const MISSION_TEMPLATES: Omit<DailyMission, 'id' | 'current' | 'isCompleted' | 'isClaimed'>[] = [
  {
    title: 'Striped Candy Crafter',
    description: 'Make 3 striped candies in any level',
    type: 'create_striped',
    target: 3,
    rewardCoins: 75,
    icon: '⚡',
  },
  {
    title: 'Wrapped Candy Master',
    description: 'Create 2 wrapped candies by making 5-candy matches',
    type: 'create_wrapped',
    target: 2,
    rewardCoins: 100,
    icon: '🍬',
  },
  {
    title: 'Color Bomb Connoisseur',
    description: 'Create 1 Rainbow Color Bomb candy',
    type: 'create_color_bomb',
    target: 1,
    rewardCoins: 150,
    icon: '🌈',
  },
  {
    title: 'Hammer Time!',
    description: 'Use a Lolly Hammer booster 2 times',
    type: 'use_hammer',
    target: 2,
    rewardCoins: 80,
    icon: '🔨',
  },
  {
    title: 'Booster Tactician',
    description: 'Use 3 boosters during gameplay',
    type: 'use_booster',
    target: 3,
    rewardCoins: 90,
    icon: '🚀',
  },
  {
    title: 'Ruby Red Matcher',
    description: 'Match 50 red candies in levels',
    type: 'match_red',
    target: 50,
    rewardCoins: 60,
    icon: '🔴',
  },
  {
    title: 'Ocean Blue Harvest',
    description: 'Match 50 blue candies in levels',
    type: 'match_blue',
    target: 50,
    rewardCoins: 60,
    icon: '🔵',
  },
  {
    title: 'Jelly Eraser',
    description: 'Clear 15 jelly tiles across any levels',
    type: 'clear_jelly',
    target: 15,
    rewardCoins: 80,
    icon: '✨',
  },
  {
    title: 'Level Crusher',
    description: 'Win 2 levels',
    type: 'win_levels',
    target: 2,
    rewardCoins: 120,
    icon: '🏆',
  },
  {
    title: 'Sugar Rush Score',
    description: 'Accumulate 10,000 score points in total',
    type: 'score_points',
    target: 10000,
    rewardCoins: 100,
    icon: '⭐',
  },
];

/**
 * Returns today's ISO date string formatted YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/**
 * Generates or retrieves 3 random missions for today.
 * If 24 hours have passed or date string differs, generates 3 new tasks.
 */
export function getOrGenerateDailyMissions(storedData?: DailyMissionsData): DailyMissionsData {
  const todayStr = getTodayDateString();

  if (storedData && storedData.lastResetDate === todayStr && storedData.missions?.length === 3) {
    return storedData;
  }

  // Shuffle & pick 3 distinct templates
  const shuffled = [...MISSION_TEMPLATES].sort(() => 0.5 - Math.random());
  const selectedTemplates = shuffled.slice(0, 3);

  const missions: DailyMission[] = selectedTemplates.map((template, idx) => ({
    ...template,
    id: `daily_${todayStr}_${idx}_${template.type}`,
    current: 0,
    isCompleted: false,
    isClaimed: false,
  }));

  return {
    lastResetDate: todayStr,
    missions,
  };
}

/**
 * Progresses matching daily missions for the player
 */
export function updateDailyMissionProgress(
  data: DailyMissionsData,
  updates: { type: DailyMissionType; amount?: number }[]
): { updatedData: DailyMissionsData; newlyCompleted: boolean } {
  let newlyCompleted = false;
  const todayStr = getTodayDateString();

  // Ensure data is up to date for today
  const currentData = getOrGenerateDailyMissions(data);

  const updatedMissions = currentData.missions.map((mission) => {
    if (mission.isCompleted) return mission;

    let addedAmount = 0;
    for (const u of updates) {
      if (u.type === mission.type) {
        addedAmount += u.amount ?? 1;
      }
    }

    if (addedAmount <= 0) return mission;

    const newCurrent = Math.min(mission.target, mission.current + addedAmount);
    const isNowCompleted = newCurrent >= mission.target;

    if (isNowCompleted && !mission.isCompleted) {
      newlyCompleted = true;
    }

    return {
      ...mission,
      current: newCurrent,
      isCompleted: isNowCompleted,
    };
  });

  return {
    updatedData: {
      lastResetDate: todayStr,
      missions: updatedMissions,
    },
    newlyCompleted,
  };
}

/**
 * Checks if player has any completed & unclaimed daily mission rewards
 */
export function hasUnclaimedMissions(data?: DailyMissionsData): boolean {
  if (!data || !data.missions) return false;
  const todayStr = getTodayDateString();
  if (data.lastResetDate !== todayStr) return true; // new daily missions waiting!
  return data.missions.some((m) => m.isCompleted && !m.isClaimed);
}

/**
 * Calculates countdown until next midnight reset
 */
export function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = Math.max(0, tomorrow.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}
