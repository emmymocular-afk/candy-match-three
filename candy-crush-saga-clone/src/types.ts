export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialCandyType = 'none' | 'striped-h' | 'striped-v' | 'wrapped' | 'color-bomb';

export interface Candy {
  id: string;
  color: CandyColor;
  type: SpecialCandyType;
  isIngredient?: boolean;
  ingredientType?: 'cherry' | 'hazelnut';
  isMatched?: boolean;
  isNew?: boolean;
}

export type BlockerType = 'none' | 'jelly-1' | 'jelly-2' | 'ice-1' | 'ice-2' | 'chocolate';

export interface BoardCell {
  row: number;
  col: number;
  candy: Candy | null;
  blocker: BlockerType;
  isExitRow?: boolean;
}

export type TargetType = 'score' | 'jelly' | 'color-collect' | 'ingredients';

export interface TargetObjective {
  type: TargetType;
  targetScore?: number;
  jellyCount?: number;
  collectColors?: Partial<Record<CandyColor, number>>;
  ingredientsCount?: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  worldName: string;
  rows: number;
  cols: number;
  moves: number;
  objective: TargetObjective;
  starScores: [number, number, number]; // [1 star, 2 star, 3 star]
  allowedColors: CandyColor[];
  initialJellyGrid?: boolean[][]; // true if cell has jelly
  initialIceGrid?: boolean[][]; // true if cell has ice
  initialChocolateGrid?: boolean[][]; // true if chocolate
  ingredientsToDrop?: number;
}

export interface PlayerStats {
  totalJelliesCleared: number;
  totalScore: number;
  levelsCompleted: number;
  totalStars: number;
  totalSpecialCandies: number;
  totalSpins: number;
}

export interface AchievementReward {
  coins: number;
  boosters?: Partial<{
    hammer: number;
    freeSwap: number;
    colorBombStart: number;
    stripedStart: number;
    extraMoves: number;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeEmoji: string;
  category: 'jelly' | 'score' | 'level' | 'stars' | 'special' | 'spin';
  targetValue: number;
  reward: AchievementReward;
}

export interface PlayerProgress {
  unlockedLevel: number;
  stars: Record<number, number>; // levelId -> stars (1-3)
  highScores: Record<number, number>; // levelId -> score
  coins: number;
  boosters: {
    hammer: number;
    freeSwap: number;
    colorBombStart: number;
    stripedStart: number;
    extraMoves: number;
  };
  claimedWorldChests?: Record<string, boolean>;
  lastSpinDate?: string;
  stats?: PlayerStats;
  claimedAchievements?: Record<string, boolean>;
  dailyMissions?: DailyMissionsData;
  dailyStreak?: DailyStreakData;
  weeklyChallenges?: WeeklyChallengesData;
}

export interface DailyStreakReward {
  day: number; // 1 to 7
  title: string;
  coins: number;
  boosters?: Partial<{
    hammer: number;
    freeSwap: number;
    colorBombStart: number;
    stripedStart: number;
    extraMoves: number;
  }>;
  icon: string;
  isMilestone?: boolean;
}

export interface DailyStreakData {
  currentStreak: number;
  lastClaimDate?: string; // YYYY-MM-DD
  highestStreak: number;
}

export type DailyMissionType =
  | 'create_striped'
  | 'create_wrapped'
  | 'create_color_bomb'
  | 'use_hammer'
  | 'use_booster'
  | 'match_red'
  | 'match_blue'
  | 'match_green'
  | 'clear_jelly'
  | 'win_levels'
  | 'score_points';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: DailyMissionType;
  target: number;
  current: number;
  rewardCoins: number;
  icon: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface DailyMissionsData {
  lastResetDate: string; // YYYY-MM-DD
  missions: DailyMission[];
}

export type ActiveBooster = 'none' | 'hammer' | 'freeSwap';

export interface Position {
  row: number;
  col: number;
}

export type WeeklyChallengeType =
  | 'clear_500_red'
  | 'clear_500_blue'
  | 'clear_500_green'
  | 'create_25_striped'
  | 'create_15_wrapped'
  | 'create_10_color_bomb'
  | 'win_15_levels'
  | 'score_150k_points'
  | 'clear_100_jelly'
  | 'use_20_boosters';

export interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  type: WeeklyChallengeType;
  target: number;
  current: number;
  rewardCoins: number;
  rewardBoosters?: Partial<{
    hammer: number;
    freeSwap: number;
    colorBombStart: number;
    stripedStart: number;
    extraMoves: number;
  }>;
  rewardBadge?: ProfileBadge;
  icon: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface WeeklyChallengesData {
  weekIdentifier: string; // e.g., "2026-W33"
  challenges: WeeklyChallenge[];
  unlockedBadgeIds?: string[];
  equippedBadgeId?: string;
}
