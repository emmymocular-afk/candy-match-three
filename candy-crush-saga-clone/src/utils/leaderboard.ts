import { getLevelConfig } from './levels';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isPlayer?: boolean;
  title?: string;
}

const MOCK_BOTS = [
  { name: 'Sugar Queen', avatar: '👑', title: 'Grandmaster' },
  { name: 'Candy King', avatar: '🍬', title: 'Saga Legend' },
  { name: 'Gummy Bear', avatar: '🐻', title: 'Jelly Crusher' },
  { name: 'Jelly Knight', avatar: '🛡️', title: 'Combo Master' },
  { name: 'Choco Baron', avatar: '🍫', title: 'Sugar Rusher' },
  { name: 'Donut Duchess', avatar: '🍩', title: 'Sweet Tooth' },
  { name: 'Marshmallow Kid', avatar: '☁️', title: 'Star Hunter' },
];

/**
 * Returns top 5 leaderboard entries for a given level, incorporating player's high score.
 */
export function getLevelLeaderboard(levelId: number, playerHighScore: number = 0): LeaderboardEntry[] {
  const config = getLevelConfig(levelId);
  const threeStarScore = config.starScores[2];

  // Deterministic seed multiplier based on levelId so bot scores are consistent per level
  const botScores = [
    Math.floor(threeStarScore * 1.45),
    Math.floor(threeStarScore * 1.25),
    Math.floor(threeStarScore * 1.05),
    Math.floor(threeStarScore * 0.88),
    Math.floor(threeStarScore * 0.72),
  ];

  const rawEntries: { name: string; avatar: string; score: number; title: string; isPlayer?: boolean }[] = [];

  // Add bots
  botScores.forEach((score, idx) => {
    const bot = MOCK_BOTS[idx % MOCK_BOTS.length];
    rawEntries.push({
      name: bot.name,
      avatar: bot.avatar,
      score,
      title: bot.title,
      isPlayer: false,
    });
  });

  // Add player if they have a score
  if (playerHighScore > 0) {
    rawEntries.push({
      name: 'You (Player)',
      avatar: '🌟',
      score: playerHighScore,
      title: 'Current Record',
      isPlayer: true,
    });
  }

  // Sort descending by score
  rawEntries.sort((a, b) => b.score - a.score);

  // Return top 5 formatted with rank
  return rawEntries.slice(0, 5).map((entry, idx) => ({
    id: entry.isPlayer ? 'player' : `bot-${idx}-${entry.name}`,
    rank: idx + 1,
    name: entry.name,
    avatar: entry.avatar,
    score: entry.score,
    isPlayer: entry.isPlayer,
    title: entry.title,
  }));
}
