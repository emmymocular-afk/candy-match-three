import { LevelConfig, CandyColor } from '../types';

export const ALL_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Sugar Starter',
    worldName: 'Candy Field',
    rows: 8,
    cols: 8,
    moves: 20,
    objective: {
      type: 'score',
      targetScore: 1000,
    },
    starScores: [1000, 2000, 3500],
    allowedColors: ['red', 'orange', 'yellow', 'green'],
  },
  {
    id: 2,
    name: 'Jelly Jubilee',
    worldName: 'Candy Field',
    rows: 8,
    cols: 8,
    moves: 22,
    objective: {
      type: 'jelly',
      jellyCount: 16,
      targetScore: 2000,
    },
    starScores: [2000, 3500, 5000],
    allowedColors: ['red', 'yellow', 'green', 'blue'],
    initialJellyGrid: createCenterJellyGrid(8, 8, 4), // 4x4 center jelly
  },
  {
    id: 3,
    name: 'Color Harvest',
    worldName: 'Candy Field',
    rows: 8,
    cols: 8,
    moves: 20,
    objective: {
      type: 'color-collect',
      collectColors: { red: 15, green: 15 },
      targetScore: 2500,
    },
    starScores: [2500, 4000, 6000],
    allowedColors: ['red', 'orange', 'green', 'blue'],
  },
  {
    id: 4,
    name: 'Ice Break',
    worldName: 'Chocolate Mountain',
    rows: 8,
    cols: 8,
    moves: 22,
    objective: {
      type: 'jelly', // using ice blocks
      jellyCount: 12,
      targetScore: 3000,
    },
    starScores: [3000, 5000, 7500],
    allowedColors: ['red', 'yellow', 'green', 'blue', 'purple'],
    initialIceGrid: createBorderIceGrid(8, 8),
  },
  {
    id: 5,
    name: 'Cherry Drop',
    worldName: 'Chocolate Mountain',
    rows: 8,
    cols: 8,
    moves: 24,
    objective: {
      type: 'ingredients',
      ingredientsCount: 2,
      targetScore: 3500,
    },
    starScores: [3500, 5500, 8000],
    allowedColors: ['red', 'orange', 'yellow', 'green', 'blue'],
    ingredientsToDrop: 2,
  },
  {
    id: 6,
    name: 'Chocolate Crunch',
    worldName: 'Chocolate Mountain',
    rows: 8,
    cols: 8,
    moves: 25,
    objective: {
      type: 'jelly',
      jellyCount: 20,
      targetScore: 4000,
    },
    starScores: [4000, 6500, 9500],
    allowedColors: ['red', 'orange', 'yellow', 'green', 'purple'],
    initialChocolateGrid: createCornerChocolateGrid(8, 8),
    initialJellyGrid: createCenterJellyGrid(8, 8, 4),
  },
  {
    id: 7,
    name: 'Rainbow Sparkle',
    worldName: 'Soda Valley',
    rows: 8,
    cols: 8,
    moves: 22,
    objective: {
      type: 'color-collect',
      collectColors: { yellow: 20, blue: 20, purple: 20 },
      targetScore: 5000,
    },
    starScores: [5000, 8000, 11000],
    allowedColors: ['red', 'yellow', 'green', 'blue', 'purple'],
  },
  {
    id: 8,
    name: 'Hazelnut Express',
    worldName: 'Soda Valley',
    rows: 8,
    cols: 8,
    moves: 25,
    objective: {
      type: 'ingredients',
      ingredientsCount: 3,
      targetScore: 6000,
    },
    starScores: [6000, 9000, 13000],
    allowedColors: ['red', 'orange', 'yellow', 'blue', 'purple'],
    ingredientsToDrop: 3,
    initialIceGrid: createCenterJellyGrid(8, 8, 2),
  },
  {
    id: 9,
    name: 'Double Jelly Craze',
    worldName: 'Soda Valley',
    rows: 8,
    cols: 8,
    moves: 26,
    objective: {
      type: 'jelly',
      jellyCount: 24,
      targetScore: 7000,
    },
    starScores: [7000, 10000, 15000],
    allowedColors: ALL_COLORS,
    initialJellyGrid: createFullJellyGridExceptBorders(8, 8),
  },
  {
    id: 10,
    name: 'Sweet Factory',
    worldName: 'Candy Factory',
    rows: 8,
    cols: 8,
    moves: 24,
    objective: {
      type: 'score',
      targetScore: 10000,
    },
    starScores: [10000, 15000, 22000],
    allowedColors: ALL_COLORS,
  },
  {
    id: 11,
    name: 'Frosty Cavern',
    worldName: 'Candy Factory',
    rows: 8,
    cols: 8,
    moves: 25,
    objective: {
      type: 'jelly',
      jellyCount: 16,
      targetScore: 8500,
    },
    starScores: [8500, 13000, 18000],
    allowedColors: ALL_COLORS,
    initialIceGrid: createBorderIceGrid(8, 8),
    initialJellyGrid: createCenterJellyGrid(8, 8, 4),
  },
  {
    id: 12,
    name: 'Chocolate Mine',
    worldName: 'Candy Factory',
    rows: 8,
    cols: 8,
    moves: 26,
    objective: {
      type: 'color-collect',
      collectColors: { red: 25, green: 25 },
      targetScore: 9000,
    },
    starScores: [9000, 14000, 20000],
    allowedColors: ALL_COLORS,
    initialChocolateGrid: createCornerChocolateGrid(8, 8),
  },
  {
    id: 13,
    name: 'Ingredient Avalanche',
    worldName: 'Sugar Kingdom',
    rows: 8,
    cols: 8,
    moves: 28,
    objective: {
      type: 'ingredients',
      ingredientsCount: 3,
      targetScore: 10000,
    },
    starScores: [10000, 15000, 22000],
    allowedColors: ALL_COLORS,
    ingredientsToDrop: 3,
    initialChocolateGrid: createCenterJellyGrid(8, 8, 2),
  },
  {
    id: 14,
    name: 'Sugar Rush Supreme',
    worldName: 'Sugar Kingdom',
    rows: 8,
    cols: 8,
    moves: 22,
    objective: {
      type: 'score',
      targetScore: 15000,
    },
    starScores: [15000, 22000, 30000],
    allowedColors: ALL_COLORS,
  },
  {
    id: 15,
    name: 'Grand Sugar Master',
    worldName: 'Sugar Kingdom',
    rows: 9,
    cols: 9,
    moves: 30,
    objective: {
      type: 'jelly',
      jellyCount: 32,
      targetScore: 20000,
    },
    starScores: [20000, 28000, 40000],
    allowedColors: ALL_COLORS,
    initialJellyGrid: createFullJellyGridExceptBorders(9, 9),
    initialChocolateGrid: createCornerChocolateGrid(9, 9),
  },
];

// Helper functions for grid layouts
function createCenterJellyGrid(rows: number, cols: number, size: number): boolean[][] {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  const startR = Math.floor((rows - size) / 2);
  const startC = Math.floor((cols - size) / 2);
  for (let r = startR; r < startR + size; r++) {
    for (let c = startC; c < startC + size; c++) {
      if (grid[r] && grid[r][c] !== undefined) {
        grid[r][c] = true;
      }
    }
  }
  return grid;
}

function createBorderIceGrid(rows: number, cols: number): boolean[][] {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let r = 1; r < rows - 1; r++) {
    grid[r][0] = true;
    grid[r][cols - 1] = true;
  }
  for (let c = 1; c < cols - 1; c++) {
    grid[0][c] = true;
    grid[rows - 1][c] = true;
  }
  return grid;
}

function createCornerChocolateGrid(rows: number, cols: number): boolean[][] {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  grid[0][0] = true;
  grid[0][cols - 1] = true;
  grid[rows - 1][0] = true;
  grid[rows - 1][cols - 1] = true;
  return grid;
}

function createFullJellyGridExceptBorders(rows: number, cols: number): boolean[][] {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      grid[r][c] = true;
    }
  }
  return grid;
}

export function getLevelConfig(levelId: number): LevelConfig {
  if (levelId <= LEVELS.length) {
    return LEVELS[levelId - 1];
  }

  // Procedurally generated high level
  const worldIndex = Math.floor((levelId - 1) / 5) % 4;
  const worlds = ['Candy Field', 'Chocolate Mountain', 'Soda Valley', 'Candy Factory', 'Sugar Kingdom'];
  const worldName = worlds[worldIndex] || 'Sugar Realm';

  const typeIndex = levelId % 4;
  let objective;
  let targetScore = 12000 + levelId * 1000;

  if (typeIndex === 0) {
    objective = { type: 'score' as const, targetScore };
  } else if (typeIndex === 1) {
    objective = { type: 'jelly' as const, jellyCount: 20 + (levelId % 10), targetScore };
  } else if (typeIndex === 2) {
    objective = {
      type: 'color-collect' as const,
      collectColors: { red: 20 + levelId, blue: 20 + levelId },
      targetScore,
    };
  } else {
    objective = { type: 'ingredients' as const, ingredientsCount: 3, targetScore };
  }

  return {
    id: levelId,
    name: `Sugar Rush #${levelId}`,
    worldName,
    rows: 8,
    cols: 8,
    moves: Math.max(18, 30 - Math.floor(levelId / 5)),
    objective,
    starScores: [targetScore, Math.floor(targetScore * 1.5), targetScore * 2],
    allowedColors: ALL_COLORS,
    ingredientsToDrop: typeIndex === 3 ? 3 : 0,
    initialJellyGrid: typeIndex === 1 ? createCenterJellyGrid(8, 8, 4) : undefined,
  };
}
