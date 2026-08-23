export interface LuckyWheelReward {
  id: string;
  name: string;
  type: 'coins' | 'hammer' | 'freeSwap' | 'colorBombStart' | 'stripedStart' | 'extraMoves' | 'jackpot';
  amount: number;
  color: string;
  bgHex: string;
  icon: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
}

export const LUCKY_WHEEL_REWARDS: LuckyWheelReward[] = [
  {
    id: 'coins_100',
    name: '100 Coins',
    type: 'coins',
    amount: 100,
    color: 'from-amber-400 to-yellow-500',
    bgHex: '#F59E0B',
    icon: '🪙',
    rarity: 'Common',
  },
  {
    id: 'hammer_1',
    name: '1 Hammer',
    type: 'hammer',
    amount: 1,
    color: 'from-pink-500 to-rose-600',
    bgHex: '#EC4899',
    icon: '🔨',
    rarity: 'Uncommon',
  },
  {
    id: 'extra_moves_1',
    name: '+5 Free Moves',
    type: 'extraMoves',
    amount: 1,
    color: 'from-emerald-400 to-teal-600',
    bgHex: '#10B981',
    icon: '➕',
    rarity: 'Rare',
  },
  {
    id: 'coins_250',
    name: '250 Coins',
    type: 'coins',
    amount: 250,
    color: 'from-yellow-400 to-amber-600',
    bgHex: '#EAB308',
    icon: '💰',
    rarity: 'Uncommon',
  },
  {
    id: 'color_bomb_1',
    name: '1 Color Bomb',
    type: 'colorBombStart',
    amount: 1,
    color: 'from-purple-500 to-indigo-600',
    bgHex: '#A855F7',
    icon: '🌈',
    rarity: 'Rare',
  },
  {
    id: 'striped_1',
    name: '1 Striped Candy',
    type: 'stripedStart',
    amount: 1,
    color: 'from-cyan-400 to-blue-600',
    bgHex: '#06B6D4',
    icon: '⚡',
    rarity: 'Uncommon',
  },
  {
    id: 'free_swap_1',
    name: '1 Free Swap',
    type: 'freeSwap',
    amount: 1,
    color: 'from-violet-400 to-purple-600',
    bgHex: '#8B5CF6',
    icon: '🖐️',
    rarity: 'Uncommon',
  },
  {
    id: 'jackpot_500',
    name: 'JACKPOT 500!',
    type: 'jackpot',
    amount: 500,
    color: 'from-rose-500 via-amber-400 to-yellow-300',
    bgHex: '#F43F5E',
    icon: '👑',
    rarity: 'Legendary',
  },
];

export const SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isFreeSpinAvailable(lastSpinDate?: string): boolean {
  if (!lastSpinDate) return true;
  const lastTime = new Date(lastSpinDate).getTime();
  if (isNaN(lastTime)) return true;
  return Date.now() - lastTime >= SPIN_COOLDOWN_MS;
}

export function getTimeUntilNextSpin(lastSpinDate?: string): {
  hours: number;
  minutes: number;
  seconds: number;
  isReady: boolean;
} {
  if (!lastSpinDate) return { hours: 0, minutes: 0, seconds: 0, isReady: true };
  const lastTime = new Date(lastSpinDate).getTime();
  if (isNaN(lastTime)) return { hours: 0, minutes: 0, seconds: 0, isReady: true };

  const elapsed = Date.now() - lastTime;
  if (elapsed >= SPIN_COOLDOWN_MS) {
    return { hours: 0, minutes: 0, seconds: 0, isReady: true };
  }

  const remaining = SPIN_COOLDOWN_MS - elapsed;
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isReady: false };
}
