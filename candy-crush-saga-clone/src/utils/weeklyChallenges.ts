import {
  WeeklyChallenge,
  WeeklyChallengeType,
  WeeklyChallengesData,
  ProfileBadge,
} from '../types';

export const ALL_PROFILE_BADGES: Record<string, ProfileBadge> = {
  ruby_titan: {
    id: 'ruby_titan',
    name: 'Ruby Titan',
    description: 'Cleared 500 Red Candies in a single week',
    icon: '🔴',
    bgGradient: 'from-rose-600 via-red-500 to-rose-700',
    borderColor: 'border-rose-300',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Ocean Sovereign',
    description: 'Harvested 500 Blue Candies in a single week',
    icon: '🔵',
    bgGradient: 'from-blue-600 via-cyan-500 to-blue-700',
    borderColor: 'border-cyan-300',
  },
  emerald_hero: {
    id: 'emerald_hero',
    name: 'Emerald Conqueror',
    description: 'Harvested 500 Green Candies in a single week',
    icon: '🟢',
    bgGradient: 'from-emerald-600 via-green-500 to-teal-700',
    borderColor: 'border-emerald-300',
  },
  lightning_crafter: {
    id: 'lightning_crafter',
    name: 'Striped Dynamo',
    description: 'Forged 25 Striped Candies in a single week',
    icon: '⚡',
    bgGradient: 'from-amber-500 via-yellow-400 to-orange-500',
    borderColor: 'border-yellow-200',
  },
  wrapped_warlock: {
    id: 'wrapped_warlock',
    name: 'Sugar Bomb Legend',
    description: 'Created 15 Wrapped Candies in a single week',
    icon: '🍬',
    bgGradient: 'from-purple-600 via-pink-500 to-purple-700',
    borderColor: 'border-pink-300',
  },
  rainbow_overlord: {
    id: 'rainbow_overlord',
    name: 'Rainbow Overlord',
    description: 'Constructed 10 Color Bombs in a single week',
    icon: '🌈',
    bgGradient: 'from-pink-500 via-purple-500 to-indigo-600',
    borderColor: 'border-amber-300',
  },
  level_titan: {
    id: 'level_titan',
    name: 'Level Titan',
    description: 'Conquered 15 total game levels in a single week',
    icon: '🏆',
    bgGradient: 'from-amber-400 via-yellow-300 to-amber-500',
    borderColor: 'border-amber-200',
  },
  score_god: {
    id: 'score_god',
    name: 'Sugar Sovereign',
    description: 'Scored 150,000 total points across levels',
    icon: '👑',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-600',
    borderColor: 'border-amber-100',
  },
  jelly_demolisher: {
    id: 'jelly_demolisher',
    name: 'Jelly Demolisher',
    description: 'Eradicated 100 Jelly tiles across levels',
    icon: '✨',
    bgGradient: 'from-cyan-500 via-sky-400 to-indigo-600',
    borderColor: 'border-cyan-200',
  },
  tactical_genius: {
    id: 'tactical_genius',
    name: 'Tactical Genius',
    description: 'Deployed 20 gameplay boosters in a single week',
    icon: '🚀',
    bgGradient: 'from-fuchsia-600 via-purple-600 to-pink-600',
    borderColor: 'border-pink-300',
  },
};

export const WEEKLY_CHALLENGE_TEMPLATES: Omit<
  WeeklyChallenge,
  'id' | 'current' | 'isCompleted' | 'isClaimed'
>[] = [
  {
    title: 'Ruby Stampede',
    description: 'Clear 500 total red candies in levels',
    type: 'clear_500_red',
    target: 500,
    rewardCoins: 600,
    rewardBoosters: { hammer: 2, stripedStart: 2 },
    rewardBadge: ALL_PROFILE_BADGES.ruby_titan,
    icon: '🔴',
  },
  {
    title: 'Ocean Tsunami',
    description: 'Clear 500 total blue candies in levels',
    type: 'clear_500_blue',
    target: 500,
    rewardCoins: 600,
    rewardBoosters: { freeSwap: 2, colorBombStart: 1 },
    rewardBadge: ALL_PROFILE_BADGES.sapphire,
    icon: '🔵',
  },
  {
    title: 'Emerald Surge',
    description: 'Clear 500 total green candies in levels',
    type: 'clear_500_green',
    target: 500,
    rewardCoins: 600,
    rewardBoosters: { extraMoves: 2, hammer: 1 },
    rewardBadge: ALL_PROFILE_BADGES.emerald_hero,
    icon: '🟢',
  },
  {
    title: 'Striped Factory',
    description: 'Create 25 Striped Candies in match-4 combos',
    type: 'create_25_striped',
    target: 25,
    rewardCoins: 800,
    rewardBoosters: { stripedStart: 3, freeSwap: 2 },
    rewardBadge: ALL_PROFILE_BADGES.lightning_crafter,
    icon: '⚡',
  },
  {
    title: 'Wrapped Explosion',
    description: 'Craft 15 Wrapped Candies with L/T shapes',
    type: 'create_15_wrapped',
    target: 15,
    rewardCoins: 850,
    rewardBoosters: { hammer: 3, extraMoves: 2 },
    rewardBadge: ALL_PROFILE_BADGES.wrapped_warlock,
    icon: '🍬',
  },
  {
    title: 'Spectrum Overlord',
    description: 'Create 10 Rainbow Color Bombs with 5-in-a-row matches',
    type: 'create_10_color_bomb',
    target: 10,
    rewardCoins: 1000,
    rewardBoosters: { colorBombStart: 3, hammer: 2 },
    rewardBadge: ALL_PROFILE_BADGES.rainbow_overlord,
    icon: '🌈',
  },
  {
    title: 'Grand Level Campaign',
    description: 'Win 15 levels across any world maps',
    type: 'win_15_levels',
    target: 15,
    rewardCoins: 1200,
    rewardBoosters: { hammer: 2, freeSwap: 2, extraMoves: 2 },
    rewardBadge: ALL_PROFILE_BADGES.level_titan,
    icon: '🏆',
  },
  {
    title: 'Millionaire Score Run',
    description: 'Accumulate 150,000 total score points',
    type: 'score_150k_points',
    target: 150000,
    rewardCoins: 1500,
    rewardBoosters: { colorBombStart: 2, stripedStart: 3, extraMoves: 2 },
    rewardBadge: ALL_PROFILE_BADGES.score_god,
    icon: '👑',
  },
  {
    title: 'Total Jelly Annihilation',
    description: 'Clear 100 Jelly tiles across all levels',
    type: 'clear_100_jelly',
    target: 100,
    rewardCoins: 750,
    rewardBoosters: { hammer: 3, freeSwap: 2 },
    rewardBadge: ALL_PROFILE_BADGES.jelly_demolisher,
    icon: '✨',
  },
  {
    title: 'Master Strategist',
    description: 'Use 20 gameplay boosters during matches',
    type: 'use_20_boosters',
    target: 20,
    rewardCoins: 900,
    rewardBoosters: { hammer: 2, freeSwap: 2, colorBombStart: 2 },
    rewardBadge: ALL_PROFILE_BADGES.tactical_genius,
    icon: '🚀',
  },
];

/**
 * Calculates current ISO year-week string (e.g. "2026-W33")
 */
export function getWeekIdentifier(): string {
  const date = new Date();
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Returns current or newly generated 4 weekly challenges for this week
 */
export function getOrGenerateWeeklyChallenges(
  storedData?: WeeklyChallengesData
): WeeklyChallengesData {
  const currentWeek = getWeekIdentifier();

  if (
    storedData &&
    storedData.weekIdentifier === currentWeek &&
    storedData.challenges?.length === 4
  ) {
    return storedData;
  }

  // Shuffle & pick 4 distinct templates
  const shuffled = [...WEEKLY_CHALLENGE_TEMPLATES].sort(() => 0.5 - Math.random());
  const selectedTemplates = shuffled.slice(0, 4);

  const challenges: WeeklyChallenge[] = selectedTemplates.map((template, idx) => ({
    ...template,
    id: `weekly_${currentWeek}_${idx}_${template.type}`,
    current: 0,
    isCompleted: false,
    isClaimed: false,
  }));

  return {
    weekIdentifier: currentWeek,
    challenges,
    unlockedBadgeIds: storedData?.unlockedBadgeIds || [],
    equippedBadgeId: storedData?.equippedBadgeId,
  };
}

/**
 * Progresses matching weekly challenges based on game events
 */
export function updateWeeklyChallengeProgress(
  data: WeeklyChallengesData,
  updates: { type: string; amount?: number }[]
): { updatedData: WeeklyChallengesData; newlyCompleted: boolean } {
  let newlyCompleted = false;
  const currentData = getOrGenerateWeeklyChallenges(data);

  const updatedChallenges = currentData.challenges.map((challenge) => {
    if (challenge.isCompleted) return challenge;

    let addedAmount = 0;

    for (const u of updates) {
      const amt = u.amount ?? 1;

      // Map daily mission / game event types to weekly challenge types
      if (challenge.type === 'clear_500_red' && u.type === 'match_red') {
        addedAmount += amt;
      } else if (challenge.type === 'clear_500_blue' && u.type === 'match_blue') {
        addedAmount += amt;
      } else if (challenge.type === 'clear_500_green' && u.type === 'match_green') {
        addedAmount += amt;
      } else if (challenge.type === 'create_25_striped' && u.type === 'create_striped') {
        addedAmount += amt;
      } else if (challenge.type === 'create_15_wrapped' && u.type === 'create_wrapped') {
        addedAmount += amt;
      } else if (challenge.type === 'create_10_color_bomb' && u.type === 'create_color_bomb') {
        addedAmount += amt;
      } else if (challenge.type === 'win_15_levels' && u.type === 'win_levels') {
        addedAmount += amt;
      } else if (challenge.type === 'score_150k_points' && u.type === 'score_points') {
        addedAmount += amt;
      } else if (challenge.type === 'clear_100_jelly' && u.type === 'clear_jelly') {
        addedAmount += amt;
      } else if (challenge.type === 'use_20_boosters' && (u.type === 'use_booster' || u.type === 'use_hammer')) {
        addedAmount += amt;
      }
    }

    if (addedAmount <= 0) return challenge;

    const newCurrent = Math.min(challenge.target, challenge.current + addedAmount);
    const isNowCompleted = newCurrent >= challenge.target;

    if (isNowCompleted && !challenge.isCompleted) {
      newlyCompleted = true;
    }

    return {
      ...challenge,
      current: newCurrent,
      isCompleted: isNowCompleted,
    };
  });

  return {
    updatedData: {
      ...currentData,
      challenges: updatedChallenges,
    },
    newlyCompleted,
  };
}

/**
 * Checks if player has completed unclaimed weekly challenges
 */
export function hasUnclaimedWeeklyChallenges(data?: WeeklyChallengesData): boolean {
  if (!data || !data.challenges) return false;
  const currentWeek = getWeekIdentifier();
  if (data.weekIdentifier !== currentWeek) return true; // new weekly challenges ready
  return data.challenges.some((c) => c.isCompleted && !c.isClaimed);
}

/**
 * Calculates countdown until weekly reset (Sunday midnight)
 */
export function getTimeUntilWeeklyReset(): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const nextSunday = new Date(now);
  const day = now.getDay(); // 0 is Sunday
  const diffDays = day === 0 ? 7 : 7 - day;

  nextSunday.setDate(now.getDate() + diffDays);
  nextSunday.setHours(0, 0, 0, 0);

  const diffMs = Math.max(0, nextSunday.getTime() - now.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}
