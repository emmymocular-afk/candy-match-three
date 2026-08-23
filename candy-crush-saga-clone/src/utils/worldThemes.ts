export interface WorldThemeConfig {
  id: string;
  name: string;
  alternateNames: string[];
  emoji: string;
  tagline: string;
  description: string;
  levelRange: [number, number];

  // LevelMap background & CSS themes
  mapBgGradient: string;
  mapBgPattern: string;
  mapOverlayElements: { emoji: string; position: string; animation: string }[];
  cardBg: string;
  cardBorder: string;
  headerBadge: string;
  pathColorUnlocked: string;
  pathColorGlow: string;
  nodeUnlockedGradient: string;
  nodeCurrentGlow: string;

  // Game Board & Active Game Level CSS Aesthetics
  gameBackground: string;
  gameAmbientEffect: 'petals' | 'cocoa-dust' | 'bubbles' | 'steam-sparks' | 'royal-stars';
  boardWrapperStyle: string;
  gridContainerStyle: string;
  cellBaseBg: string;
  cellEmptyBg: string;
  cellHoverGlow: string;

  // Theme Color Palette
  primaryColor: string;
  accentColor: string;
  textColor: string;
}

export const WORLD_THEMES_CONFIG: WorldThemeConfig[] = [
  {
    id: 'candy-field',
    name: 'Candy Forest',
    alternateNames: ['Candy Field', 'Candy Forest', 'Sugar Starter', 'Sugar Forest'],
    emoji: '🌸',
    tagline: 'Fresh minty greens & sweet blooming jelly trees',
    description: 'A serene pastel wonderland overflowing with sugar foliage, jelly flowers, and candy vines.',
    levelRange: [1, 3],

    mapBgGradient: 'from-emerald-950 via-teal-900 to-[#122b22]',
    mapBgPattern: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
    mapOverlayElements: [
      { emoji: '🌿', position: 'top-12 left-6', animation: 'animate-float-bubble' },
      { emoji: '🌸', position: 'top-1/3 right-8', animation: 'animate-pulse' },
      { emoji: '🍃', position: 'bottom-20 left-10', animation: 'animate-float-bubble' },
    ],
    cardBg: 'bg-emerald-950/70 backdrop-blur-md',
    cardBorder: 'border-emerald-400/40 shadow-emerald-950/80',
    headerBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50',
    pathColorUnlocked: '#38ef7d',
    pathColorGlow: 'rgba(56, 239, 125, 0.4)',
    nodeUnlockedGradient: 'from-emerald-400 via-teal-500 to-emerald-700',
    nodeCurrentGlow: 'shadow-emerald-500/80 ring-emerald-300',

    gameBackground: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-teal-950 to-[#0a1813]',
    gameAmbientEffect: 'petals',
    boardWrapperStyle: 'bg-emerald-950/60 border-2 border-emerald-400/30 shadow-[0_0_35px_rgba(16,185,129,0.3)]',
    gridContainerStyle: 'bg-emerald-950/90 border border-emerald-500/30 shadow-inner shadow-emerald-900/50',
    cellBaseBg: 'bg-emerald-900/30 border border-emerald-500/20 hover:bg-emerald-800/40',
    cellEmptyBg: 'bg-emerald-950/50 border border-emerald-900/30',
    cellHoverGlow: 'ring-emerald-400',

    primaryColor: '#10b981',
    accentColor: '#34d399',
    textColor: '#a7f3d0',
  },
  {
    id: 'chocolate-mountain',
    name: 'Chocolate Mountain',
    alternateNames: ['Chocolate Mountain', 'Cocoa Ridge', 'Fudge Peak'],
    emoji: '🍫',
    tagline: 'Rich cocoa peaks, fudge rivers & caramel crags',
    description: 'Towering chocolate summits carved with caramel waterfalls and roasted hazelnut cliffs.',
    levelRange: [4, 6],

    mapBgGradient: 'from-[#2b1810] via-amber-950 to-[#1c0e08]',
    mapBgPattern: 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 60%)',
    mapOverlayElements: [
      { emoji: '🍫', position: 'top-10 right-6', animation: 'animate-float-bubble' },
      { emoji: '🥜', position: 'top-1/2 left-8', animation: 'animate-pulse' },
      { emoji: '☕', position: 'bottom-24 right-10', animation: 'animate-float-bubble' },
    ],
    cardBg: 'bg-amber-950/70 backdrop-blur-md',
    cardBorder: 'border-amber-500/40 shadow-amber-950/80',
    headerBadge: 'bg-amber-500/20 text-amber-200 border-amber-400/50',
    pathColorUnlocked: '#f59e0b',
    pathColorGlow: 'rgba(245, 158, 11, 0.4)',
    nodeUnlockedGradient: 'from-amber-400 via-amber-600 to-amber-800',
    nodeCurrentGlow: 'shadow-amber-500/80 ring-amber-300',

    gameBackground: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950 via-[#23120b] to-[#120804]',
    gameAmbientEffect: 'cocoa-dust',
    boardWrapperStyle: 'bg-amber-950/60 border-2 border-amber-500/30 shadow-[0_0_35px_rgba(217,119,6,0.35)]',
    gridContainerStyle: 'bg-[#1a0e08]/90 border border-amber-700/30 shadow-inner shadow-amber-950/60',
    cellBaseBg: 'bg-amber-950/50 border border-amber-700/25 hover:bg-amber-900/50',
    cellEmptyBg: 'bg-[#180a04]/50 border border-amber-950/50',
    cellHoverGlow: 'ring-amber-400',

    primaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    textColor: '#fde68a',
  },
  {
    id: 'soda-valley',
    name: 'Sugar Sea',
    alternateNames: ['Soda Valley', 'Sugar Sea', 'Fizzy Bay', 'Soda Ocean'],
    emoji: '🥤',
    tagline: 'Fizzy electric bubbles & sparkling blue waves',
    description: 'An endless carbonated ocean overflowing with fizzy waves, ice pop glaciers, and sparkling soda tidepools.',
    levelRange: [7, 9],

    mapBgGradient: 'from-cyan-950 via-blue-950 to-[#0a182e]',
    mapBgPattern: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
    mapOverlayElements: [
      { emoji: '🫧', position: 'top-14 left-8', animation: 'animate-float-bubble' },
      { emoji: '🌊', position: 'top-2/5 right-6', animation: 'animate-pulse' },
      { emoji: '🧊', position: 'bottom-20 left-12', animation: 'animate-float-bubble' },
    ],
    cardBg: 'bg-cyan-950/70 backdrop-blur-md',
    cardBorder: 'border-cyan-400/40 shadow-cyan-950/80',
    headerBadge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50',
    pathColorUnlocked: '#00f2fe',
    pathColorGlow: 'rgba(0, 242, 254, 0.4)',
    nodeUnlockedGradient: 'from-cyan-400 via-blue-500 to-indigo-700',
    nodeCurrentGlow: 'shadow-cyan-500/80 ring-cyan-300',

    gameBackground: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950 via-blue-950 to-[#061224]',
    gameAmbientEffect: 'bubbles',
    boardWrapperStyle: 'bg-cyan-950/60 border-2 border-cyan-400/30 shadow-[0_0_35px_rgba(6,182,212,0.35)]',
    gridContainerStyle: 'bg-cyan-950/90 border border-cyan-500/30 shadow-inner shadow-cyan-950/60',
    cellBaseBg: 'bg-cyan-900/30 border border-cyan-400/20 hover:bg-cyan-800/40',
    cellEmptyBg: 'bg-cyan-950/50 border border-cyan-900/30',
    cellHoverGlow: 'ring-cyan-300',

    primaryColor: '#06b6d4',
    accentColor: '#38bdf8',
    textColor: '#a5f3fc',
  },
  {
    id: 'candy-factory',
    name: 'Candy Factory',
    alternateNames: ['Candy Factory', 'Sweet Factory', 'Candy Engine'],
    emoji: '⚙️',
    tagline: 'Steamy gears, glowing conveyors & sweet machines',
    description: 'An industrious sweet factory powered by sugar steam engines, conveyor belts, and neon syrup pipes.',
    levelRange: [10, 12],

    mapBgGradient: 'from-purple-950 via-fuchsia-950 to-[#220d2a]',
    mapBgPattern: 'radial-gradient(circle at 50% 20%, rgba(217, 70, 239, 0.15) 0%, transparent 60%)',
    mapOverlayElements: [
      { emoji: '⚙️', position: 'top-10 left-6', animation: 'animate-spin' },
      { emoji: '🏭', position: 'top-1/3 right-8', animation: 'animate-pulse' },
      { emoji: '⚡', position: 'bottom-28 left-10', animation: 'animate-float-bubble' },
    ],
    cardBg: 'bg-purple-950/70 backdrop-blur-md',
    cardBorder: 'border-fuchsia-400/40 shadow-purple-950/80',
    headerBadge: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/50',
    pathColorUnlocked: '#d946ef',
    pathColorGlow: 'rgba(217, 70, 239, 0.4)',
    nodeUnlockedGradient: 'from-fuchsia-400 via-purple-600 to-pink-700',
    nodeCurrentGlow: 'shadow-fuchsia-500/80 ring-fuchsia-300',

    gameBackground: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-950 via-purple-950 to-[#18081f]',
    gameAmbientEffect: 'steam-sparks',
    boardWrapperStyle: 'bg-purple-950/60 border-2 border-fuchsia-400/30 shadow-[0_0_35px_rgba(217,70,239,0.35)]',
    gridContainerStyle: 'bg-purple-950/90 border border-fuchsia-500/30 shadow-inner shadow-purple-950/60',
    cellBaseBg: 'bg-fuchsia-950/40 border border-fuchsia-400/20 hover:bg-fuchsia-900/40',
    cellEmptyBg: 'bg-purple-950/50 border border-purple-900/30',
    cellHoverGlow: 'ring-fuchsia-300',

    primaryColor: '#d946ef',
    accentColor: '#f0abfc',
    textColor: '#f5d0fe',
  },
  {
    id: 'sugar-kingdom',
    name: 'Sugar Kingdom',
    alternateNames: ['Sugar Kingdom', 'Sugar Realm', 'Royal Palace'],
    emoji: '👑',
    tagline: 'Grand royal palace, golden crowns & magical sweets',
    description: 'The crowning glory of the candy saga—a grand royal palace made of golden caramel, spun sugar crowns, and sparkling jewels.',
    levelRange: [13, 15],

    mapBgGradient: 'from-rose-950 via-purple-900 to-[#2D1B4D]',
    mapBgPattern: 'radial-gradient(circle at 50% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 60%)',
    mapOverlayElements: [
      { emoji: '👑', position: 'top-12 right-6', animation: 'animate-float-bubble' },
      { emoji: '✨', position: 'top-2/5 left-8', animation: 'animate-pulse' },
      { emoji: '🏰', position: 'bottom-24 right-10', animation: 'animate-float-bubble' },
    ],
    cardBg: 'bg-rose-950/70 backdrop-blur-md',
    cardBorder: 'border-amber-300/50 shadow-rose-950/80',
    headerBadge: 'bg-rose-500/20 text-amber-200 border-amber-300/50',
    pathColorUnlocked: '#FDC830',
    pathColorGlow: 'rgba(253, 200, 48, 0.5)',
    nodeUnlockedGradient: 'from-amber-300 via-rose-500 to-purple-700',
    nodeCurrentGlow: 'shadow-yellow-400/80 ring-yellow-300',

    gameBackground: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950 via-rose-950 to-[#1a0f05]',
    gameAmbientEffect: 'royal-stars',
    boardWrapperStyle: 'bg-[#24130b]/70 border-2 border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.35)]',
    gridContainerStyle: 'bg-[#211108]/90 border border-amber-500/30 shadow-inner shadow-amber-950/60',
    cellBaseBg: 'bg-amber-900/30 border border-amber-300/20 hover:bg-amber-800/40',
    cellEmptyBg: 'bg-amber-950/50 border border-amber-900/30',
    cellHoverGlow: 'ring-amber-300',

    primaryColor: '#f59e0b',
    accentColor: '#fcd34d',
    textColor: '#fef08a',
  },
];

export function getWorldThemeByLevelId(levelId: number): WorldThemeConfig {
  const match = WORLD_THEMES_CONFIG.find(
    (theme) => levelId >= theme.levelRange[0] && levelId <= theme.levelRange[1]
  );

  if (match) return match;

  // For high levels (16+), cycle through the 5 themes based on level range blocks
  const themeIndex = Math.floor((levelId - 1) / 3) % WORLD_THEMES_CONFIG.length;
  return WORLD_THEMES_CONFIG[themeIndex] || WORLD_THEMES_CONFIG[0];
}

export function getWorldThemeByName(worldName: string): WorldThemeConfig {
  const normalized = worldName.toLowerCase().trim();
  const match = WORLD_THEMES_CONFIG.find(
    (theme) =>
      theme.name.toLowerCase() === normalized ||
      theme.alternateNames.some((alt) => alt.toLowerCase() === normalized)
  );

  if (match) return match;

  if (normalized.includes('forest') || normalized.includes('field')) {
    return WORLD_THEMES_CONFIG[0]; // Candy Forest
  }
  if (normalized.includes('mountain') || normalized.includes('chocolate') || normalized.includes('cocoa')) {
    return WORLD_THEMES_CONFIG[1]; // Chocolate Mountain
  }
  if (normalized.includes('sea') || normalized.includes('soda') || normalized.includes('valley') || normalized.includes('ocean')) {
    return WORLD_THEMES_CONFIG[2]; // Sugar Sea / Soda Valley
  }
  if (normalized.includes('factory') || normalized.includes('gear')) {
    return WORLD_THEMES_CONFIG[3]; // Candy Factory
  }
  if (normalized.includes('kingdom') || normalized.includes('palace') || normalized.includes('royal')) {
    return WORLD_THEMES_CONFIG[4]; // Sugar Kingdom
  }

  return WORLD_THEMES_CONFIG[0];
}

export function getAllWorldThemes(): WorldThemeConfig[] {
  return WORLD_THEMES_CONFIG;
}
