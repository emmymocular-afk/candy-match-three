import React, { useState, useEffect, useRef } from 'react';
import { PlayerProgress, LevelConfig } from '../types';
import { getLevelConfig, LEVELS } from '../utils/levels';
import { WORLD_THEMES_CONFIG, WorldThemeConfig } from '../utils/worldThemes';
import { Star, Lock, Zap, Boxes, CheckCircle2, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface DirtRoadLandscapeProps {
  progress: PlayerProgress;
  onSelectLevel: (levelConfig: LevelConfig) => void;
  claimedChests: Record<string, boolean>;
  onClaimChest: (world: WorldThemeConfig) => void;
}

interface FruitPlant {
  id: string;
  name: string;
  emoji: string;
  xPercent: number; // 0 to 100
  yPx: number; // vertical position in pixels on map canvas
  description: string;
  tag: string;
}

interface MountainPeak {
  id: string;
  xPercent: number;
  yPx: number;
  width: number;
  height: number;
  name: string;
  isSnowy?: boolean;
}

export const DirtRoadLandscape: React.FC<DirtRoadLandscapeProps> = ({
  progress,
  onSelectLevel,
  claimedChests,
  onClaimChest,
}) => {
  const [activeFruitToast, setActiveFruitToast] = useState<{
    name: string;
    emoji: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const activeLevelRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to current active level on mount
  useEffect(() => {
    if (activeLevelRef.current) {
      setTimeout(() => {
        activeLevelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [progress.unlockedLevel]);

  // Total canvas height for the 15-level dirt road journey
  const CANVAS_HEIGHT = 2600;

  // Exact coordinates for levels 1 to 15 (bottom to top)
  // Level 1 starts near bottom (y = 2420px), Level 15 ends at top summit (y = 80px)
  const levelPositions: Array<{ id: number; x: number; y: number }> = [
    { id: 1, x: 50, y: 2420 },
    { id: 2, x: 25, y: 2260 },
    { id: 3, x: 75, y: 2100 },
    { id: 4, x: 30, y: 1920 },
    { id: 5, x: 72, y: 1740 },
    { id: 6, x: 32, y: 1560 },
    { id: 7, x: 75, y: 1380 },
    { id: 8, x: 26, y: 1200 }, // River bridge crossing
    { id: 9, x: 68, y: 1020 },
    { id: 10, x: 30, y: 840 },
    { id: 11, x: 72, y: 660 },
    { id: 12, x: 32, y: 480 },
    { id: 13, x: 75, y: 320 },
    { id: 14, x: 25, y: 180 },
    { id: 15, x: 50, y: 70 }, // Royal Summit Castle
  ];

  // Flanking Fruit-Bearing Plants along the Dirt Road
  const fruitPlants: FruitPlant[] = [
    {
      id: 'apple-1',
      name: 'Honeycrisp Apple Tree',
      emoji: '🍎',
      xPercent: 12,
      yPx: 2360,
      description: 'Lush orchard tree bursting with crisp red apples!',
      tag: '+5 Sweetness',
    },
    {
      id: 'strawberry-1',
      name: 'Wild Strawberry Patch',
      emoji: '🍓',
      xPercent: 82,
      yPx: 2300,
      description: 'Sun-ripened strawberry beds lining the dirt path edge.',
      tag: 'Juicy Berry',
    },
    {
      id: 'cherry-1',
      name: 'Sweet Cherry Grove',
      emoji: '🍒',
      xPercent: 88,
      yPx: 2040,
      description: 'Vibrant cherry trees with clusters of sweet red fruit.',
      tag: 'Cherry Delight',
    },
    {
      id: 'blueberry-1',
      name: 'Wild Blueberry Bush',
      emoji: '🫐',
      xPercent: 10,
      yPx: 2000,
      description: 'Dense woodland berry bushes full of plump blueberries.',
      tag: 'Wild Berry',
    },
    {
      id: 'orange-1',
      name: 'Sun-Kissed Orange Tree',
      emoji: '🍊',
      xPercent: 12,
      yPx: 1860,
      description: 'Citrus trees laden with bright, sweet orange fruit.',
      tag: 'Citrus Boost',
    },
    {
      id: 'lemon-1',
      name: 'Meyer Lemon Grove',
      emoji: '🍋',
      xPercent: 86,
      yPx: 1680,
      description: 'Fragrant lemon trees glowing yellow in the mountain valley.',
      tag: 'Zesty Lemon',
    },
    {
      id: 'grape-1',
      name: 'Royal Grape Vineyard',
      emoji: '🍇',
      xPercent: 14,
      yPx: 1500,
      description: 'Wooden trellises with hanging purple grape clusters.',
      tag: 'Grape Harvest',
    },
    {
      id: 'pear-1',
      name: 'Golden Pear Orchard',
      emoji: '🍐',
      xPercent: 85,
      yPx: 1320,
      description: 'Shady pear trees bearing sweet, juicy yellow pears.',
      tag: 'Pear Bliss',
    },
    {
      id: 'watermelon-1',
      name: 'Sunny Watermelon Plot',
      emoji: '🍉',
      xPercent: 10,
      yPx: 1140,
      description: 'Vine-strewn meadow patch with giant striped watermelons.',
      tag: 'Cool Refreshment',
    },
    {
      id: 'apple-2',
      name: 'Red Delicious Apple Tree',
      emoji: '🍎',
      xPercent: 84,
      yPx: 960,
      description: 'Highland apple trees with sweet ruby apples.',
      tag: 'Crisp Apple',
    },
    {
      id: 'strawberry-2',
      name: 'Mountain Berry Bed',
      emoji: '🍓',
      xPercent: 12,
      yPx: 780,
      description: 'Wild strawberry patches thriving in the cool mountain dirt.',
      tag: 'Wild Strawberry',
    },
    {
      id: 'orange-2',
      name: 'Highland Citrus Grove',
      emoji: '🍊',
      xPercent: 86,
      yPx: 600,
      description: 'Fragrant oranges growing along the factory road.',
      tag: 'Citrus Glow',
    },
    {
      id: 'golden-apple',
      name: 'Royal Golden Apple Tree',
      emoji: '🌟',
      xPercent: 12,
      yPx: 260,
      description: 'Enchanted golden fruit tree at the gates of Sugar Kingdom!',
      tag: 'Royal Fruit',
    },
    {
      id: 'royal-cherry',
      name: 'Imperial Palace Cherry Trees',
      emoji: '🍒',
      xPercent: 86,
      yPx: 120,
      description: 'Majestic cherry blossoms framing the final royal summit castle.',
      tag: 'Imperial Bloom',
    },
  ];

  // Mountain Peaks Flanking the Dirt Road
  const mountainPeaks: MountainPeak[] = [
    { id: 'm1', xPercent: 2, yPx: 2150, width: 140, height: 110, name: 'Emerald Foothills' },
    { id: 'm2', xPercent: 82, yPx: 2180, width: 150, height: 120, name: 'Green Ridge' },
    { id: 'm3', xPercent: 0, yPx: 1780, width: 170, height: 140, name: 'Chocolate Crag', isSnowy: true },
    { id: 'm4', xPercent: 80, yPx: 1820, width: 180, height: 150, name: 'Cocoa Summit', isSnowy: true },
    { id: 'm5', xPercent: 2, yPx: 1300, width: 160, height: 130, name: 'Soda Canyon' },
    { id: 'm6', xPercent: 82, yPx: 1240, width: 170, height: 140, name: 'Fizzy Bluffs' },
    { id: 'm7', xPercent: 0, yPx: 700, width: 180, height: 160, name: 'Steam Mountain', isSnowy: true },
    { id: 'm8', xPercent: 80, yPx: 640, width: 190, height: 170, name: 'Sugar Peak', isSnowy: true },
    { id: 'm9', xPercent: 2, yPx: 160, width: 200, height: 180, name: 'Royal Ice Summit', isSnowy: true },
    { id: 'm10', xPercent: 78, yPx: 100, width: 210, height: 190, name: 'Imperial Castle Summit', isSnowy: true },
  ];

  // Helper to generate smooth SVG cubic bezier path string for the dirt road
  const generateRoadPathString = () => {
    if (levelPositions.length === 0) return '';
    let d = `M ${levelPositions[0].x}% ${levelPositions[0].y}`;

    for (let i = 0; i < levelPositions.length - 1; i++) {
      const curr = levelPositions[i];
      const next = levelPositions[i + 1];

      const midY = curr.y - (curr.y - next.y) * 0.5;

      // Cubic Bezier curve control points
      d += ` C ${curr.x}% ${midY}, ${next.x}% ${midY}, ${next.x}% ${next.y}`;
    }
    return d;
  };

  // Helper to generate the winding river SVG path
  const generateRiverPathString = () => {
    // Flows down from top right mountain (x=85%, y=0) through valley to bottom left (x=10%, y=2600)
    return `
      M 85% 0
      C 65% 300, 85% 600, 70% 900
      C 55% 1050, 15% 1150, 26% 1200
      C 40% 1300, 80% 1600, 65% 1850
      C 50% 2000, 20% 2100, 50% 2250
      C 80% 2400, 20% 2500, 10% 2600
    `;
  };

  const handleFruitClick = (plant: FruitPlant, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveFruitToast({
      name: plant.name,
      emoji: plant.emoji,
      text: `${plant.description} (${plant.tag})`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

    setTimeout(() => {
      setActiveFruitToast(null);
    }, 2800);
  };

  const roadPathD = generateRoadPathString();
  const riverPathD = generateRiverPathString();

  return (
    <div
      className="relative w-full max-w-lg mx-auto overflow-hidden rounded-[36px] shadow-2xl border-4 border-amber-900/40 bg-gradient-to-b from-[#112a1f] via-[#23152d] to-[#12281b]"
      style={{ height: `${CANVAS_HEIGHT}px` }}
    >
      {/* Background Terrain Texture & Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Candy Forest Grass Base */}
        <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-emerald-950/90 via-teal-950/70 to-transparent" />
        {/* Chocolate Mountain Ground */}
        <div className="absolute bottom-[600px] left-0 right-0 h-[600px] bg-gradient-to-t from-amber-950/90 via-amber-900/60 to-transparent" />
        {/* Soda Valley Meadow */}
        <div className="absolute bottom-[1200px] left-0 right-0 h-[600px] bg-gradient-to-t from-cyan-950/80 via-blue-950/60 to-transparent" />
        {/* Candy Factory Terrain */}
        <div className="absolute bottom-[1800px] left-0 right-0 h-[500px] bg-gradient-to-t from-purple-950/90 via-fuchsia-950/60 to-transparent" />
        {/* Sugar Kingdom Summit */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-rose-950/90 via-purple-950/80 to-transparent" />
      </div>

      {/* SVG Map Layer: River, Bridges & Dirt Road */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ height: `${CANVAS_HEIGHT}px` }}
      >
        <defs>
          {/* Dirt Road Gradient Texture */}
          <linearGradient id="dirtRoadGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5a2b" />
            <stop offset="25%" stopColor="#9c6633" />
            <stop offset="50%" stopColor="#805026" />
            <stop offset="75%" stopColor="#8b5a2b" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>

          {/* Dirt Road Inner Surface */}
          <linearGradient id="dirtRoadSurface" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c29b62" />
            <stop offset="30%" stopColor="#d2a679" />
            <stop offset="60%" stopColor="#b58d54" />
            <stop offset="100%" stopColor="#e2c08d" />
          </linearGradient>

          {/* River Water Gradient */}
          <linearGradient id="riverWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>

          {/* Active Path Glow */}
          <linearGradient id="unlockedPathGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#facc15" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 1. WINDING BLUE RIVER */}
        <g id="river-layer">
          {/* River Outer Embankment */}
          <path
            d={riverPathD}
            fill="none"
            stroke="#0369a1"
            strokeWidth="36"
            strokeLinecap="round"
          />
          {/* Main Shimmering Water */}
          <path
            d={riverPathD}
            fill="none"
            stroke="url(#riverWater)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Water Ripples Animation */}
          <path
            d={riverPathD}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="5"
            strokeDasharray="14 20"
            strokeLinecap="round"
            className="animate-path-flow opacity-70"
          />
        </g>

        {/* 2. THE DIRT ROAD PATH */}
        <g id="dirt-road-layer">
          {/* Grassy Outer Verge / Road Border */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#2d4d1e"
            strokeWidth="58"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dark Soil Base Layer */}
          <path
            d={roadPathD}
            fill="none"
            stroke="url(#dirtRoadGradient)"
            strokeWidth="44"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sandy/Gravel Dirt Surface */}
          <path
            d={roadPathD}
            fill="none"
            stroke="url(#dirtRoadSurface)"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Dirt Tire Track / Footpath Dashes */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#6b4226"
            strokeWidth="4"
            strokeDasharray="10 12"
            strokeLinecap="round"
          />

          {/* Golden Glow Highlight for Unlocked Progress */}
          <path
            d={roadPathD}
            fill="none"
            stroke="url(#unlockedPathGlow)"
            strokeWidth="7"
            strokeDasharray="12 12"
            strokeLinecap="round"
            className="animate-path-flow"
          />
        </g>
      </svg>

      {/* Flanking Mountains Layer */}
      {mountainPeaks.map((m) => (
        <div
          key={m.id}
          className="absolute pointer-events-none z-0 flex flex-col items-center justify-end"
          style={{
            left: `${m.xPercent}%`,
            top: `${m.yPx}px`,
            width: `${m.width}px`,
            height: `${m.height}px`,
          }}
        >
          {/* Mountain Peak Vector Graphic */}
          <div className="relative w-full h-full flex items-end justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl opacity-85">
              <polygon
                points="50,10 95,95 5,95"
                fill={m.isSnowy ? '#334155' : '#27203a'}
                stroke="#1e1830"
                strokeWidth="2"
              />
              {/* Snow Cap */}
              {m.isSnowy && (
                <polygon points="50,10 65,38 58,34 50,42 42,34 35,38" fill="#f8fafc" />
              )}
            </svg>
            <span className="absolute bottom-1 text-[9px] font-bold text-amber-200/60 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
              🏔️ {m.name}
            </span>
          </div>
        </div>
      ))}

      {/* Flanking Trees & Forest Clumps */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {/* Pine trees along upper levels */}
        <div className="absolute top-[200px] left-[6%] text-3xl animate-float-bubble">🌲</div>
        <div className="absolute top-[240px] left-[18%] text-2xl">🌲</div>
        <div className="absolute top-[380px] right-[8%] text-3xl">🌲</div>
        <div className="absolute top-[520px] left-[8%] text-3xl">🌲</div>
        <div className="absolute top-[680px] right-[10%] text-3xl">🌲</div>

        {/* Oak trees & Birch trees along mid levels */}
        <div className="absolute top-[900px] left-[8%] text-3xl">🌳</div>
        <div className="absolute top-[1080px] right-[10%] text-3xl">🌳</div>
        <div className="absolute top-[1260px] left-[10%] text-3xl">🌳</div>
        <div className="absolute top-[1420px] right-[8%] text-3xl">🌳</div>

        {/* Blossom trees along lower levels */}
        <div className="absolute top-[1620px] left-[8%] text-3xl">🌸</div>
        <div className="absolute top-[1800px] right-[10%] text-3xl">🌳</div>
        <div className="absolute top-[2020px] left-[10%] text-3xl">🌳</div>
        <div className="absolute top-[2200px] right-[8%] text-3xl">🌸</div>
        <div className="absolute top-[2380px] left-[8%] text-3xl">🌳</div>

        {/* Birds & Clouds floating in sky */}
        <div className="absolute top-[120px] left-[35%] text-2xl animate-float-bubble opacity-80">🦅</div>
        <div className="absolute top-[480px] right-[30%] text-xl animate-pulse opacity-70">☁️</div>
        <div className="absolute top-[1100px] left-[20%] text-xl animate-float-bubble opacity-70">☁️</div>
        <div className="absolute top-[1700px] right-[25%] text-xl animate-pulse opacity-70">🦋</div>
      </div>

      {/* Wooden Footbridge Over River Crossing */}
      <div
        className="absolute z-2 pointer-events-none flex items-center justify-center"
        style={{ left: '26%', top: '1200px', transform: 'translate(-50%, -50%)' }}
      >
        <div className="bg-amber-900 border-2 border-amber-700 text-amber-200 px-3 py-1 rounded-lg text-xs font-black shadow-2xl flex items-center gap-1 opacity-95">
          <span>🪵</span>
          <span>River Bridge</span>
          <span>🌉</span>
        </div>
      </div>

      {/* Interactive Fruit-Bearing Plants Flanking the Dirt Road */}
      {fruitPlants.map((plant) => (
        <button
          key={plant.id}
          onClick={(e) => handleFruitClick(plant, e)}
          className="absolute z-10 group cursor-pointer transition transform hover:scale-125 active:scale-95 flex flex-col items-center"
          style={{
            left: `${plant.xPercent}%`,
            top: `${plant.yPx}px`,
            transform: 'translate(-50%, -50%)',
          }}
          title={`${plant.name} - Click to inspect!`}
        >
          {/* Fruit Tree / Plant Display */}
          <div className="relative p-2 rounded-2xl bg-emerald-950/60 border border-emerald-400/40 shadow-xl backdrop-blur-xs flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-950/80 transition">
            <span className="text-3xl filter drop-shadow-md group-hover:animate-bounce">
              {plant.emoji}
            </span>

            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 text-[10px] bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center font-black shadow">
              ✨
            </span>
          </div>

          <span className="mt-1 text-[9px] font-extrabold text-amber-200/90 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/30 whitespace-nowrap shadow group-hover:text-amber-300">
            {plant.name}
          </span>
        </button>
      ))}

      {/* World Transition Region Wooden Signposts & Chest Platforms */}
      {WORLD_THEMES_CONFIG.map((world, idx) => {
        // Find level range end for this world
        const endLevelId = world.levelRange[1];
        const endNode = levelPositions.find((p) => p.id === endLevelId);
        if (!endNode) return null;

        const worldLevels = LEVELS.filter(
          (l) => l.id >= world.levelRange[0] && l.id <= world.levelRange[1]
        );
        const totalStarsAvail = worldLevels.length * 3;
        const currentStars = worldLevels.reduce(
          (acc, l) => acc + (progress.stars[l.id] || 0),
          0
        );
        const isCompleted = currentStars >= totalStarsAvail;
        const isClaimed = !!claimedChests[world.id];

        // Signpost Y position slightly above the last level in the world
        const signY = endNode.y - 70;
        const signX = idx % 2 === 0 ? 82 : 18;

        return (
          <div
            key={`world-sign-${world.id}`}
            className="absolute z-10 flex flex-col items-center"
            style={{
              left: `${signX}%`,
              top: `${signY}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Wooden Directional Signpost */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 border-2 border-amber-500/60 rounded-xl px-3 py-1.5 shadow-2xl text-center flex flex-col items-center gap-0.5 max-w-[140px]">
              <div className="flex items-center gap-1 text-xs font-black text-amber-200">
                <span>{world.emoji}</span>
                <span className="truncate">{world.name}</span>
              </div>
              <span className="text-[9px] text-amber-300/80 font-bold">
                ⭐ {currentStars}/{totalStarsAvail}
              </span>

              {/* World Chest Button */}
              <button
                onClick={() => onClaimChest(world)}
                disabled={!isCompleted || isClaimed}
                className={`mt-1 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black transition transform ${
                  isClaimed
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : isCompleted
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 animate-bounce shadow-lg hover:scale-105'
                    : 'bg-black/40 text-purple-200 border border-white/10 opacity-60'
                }`}
              >
                <Boxes className="w-3 h-3" />
                {isClaimed ? 'Claimed' : isCompleted ? 'REWARD!' : 'Chest'}
              </button>
            </div>
            {/* Signpost Wooden Pole */}
            <div className="w-2 h-5 bg-amber-950 border-x border-amber-800" />
          </div>
        );
      })}

      {/* LEVEL NODES RESTING DIRECTLY ON THE DIRT ROAD */}
      {LEVELS.map((level) => {
        const pos = levelPositions.find((p) => p.id === level.id);
        if (!pos) return null;

        const isUnlocked = level.id <= progress.unlockedLevel;
        const isCurrent = level.id === progress.unlockedLevel;
        const starsCount = progress.stars[level.id] || 0;
        const world = WORLD_THEMES_CONFIG.find(
          (w) => level.id >= w.levelRange[0] && level.id <= w.levelRange[1]
        ) || WORLD_THEMES_CONFIG[0];

        return (
          <div
            key={level.id}
            ref={isCurrent ? activeLevelRef : null}
            className="absolute z-20 flex flex-col items-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Active Level Wooden Lantern / "PLAY HERE" Indicator */}
            {isCurrent && (
              <div className="absolute -top-9 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-2xl border-2 border-white animate-bounce flex items-center gap-1 z-30 whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                PLAY HERE!
              </div>
            )}

            {/* Cobblestone Dirt Road Milestone Base */}
            <div className="relative flex items-center justify-center">
              {/* Dirt stepping stone ring */}
              <div
                className={`absolute -inset-2 rounded-[32px] border-2 border-amber-900/60 bg-amber-950/70 shadow-2xl ${
                  isCurrent ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-emerald-950 animate-pulse' : ''
                }`}
              />

              {/* Level Button Node */}
              <button
                onClick={() => {
                  if (!isUnlocked) {
                    sound.playInvalid();
                    return;
                  }
                  sound.playPop();
                  const config = getLevelConfig(level.id);
                  onSelectLevel(config);
                }}
                disabled={!isUnlocked}
                className={`
                  relative w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] flex flex-col items-center justify-center font-black transition-all duration-300 transform
                  ${
                    isCurrent
                      ? `bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-200 text-slate-950 scale-110 shadow-2xl shadow-yellow-500/80 z-20 border-2 border-white ${world.nodeCurrentGlow}`
                      : isUnlocked
                      ? `bg-gradient-to-tr ${world.nodeUnlockedGradient} text-white hover:scale-110 shadow-xl active:scale-95 border-2 border-white/30`
                      : 'bg-slate-900/90 text-slate-500 border border-white/10 opacity-70 cursor-not-allowed backdrop-blur-xs'
                  }
                `}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-lg sm:text-xl leading-none font-black drop-shadow">
                      {level.id}
                    </span>

                    {/* Star Ratings */}
                    <div className="flex gap-0.5 mt-1">
                      <Star
                        className={`w-3 h-3 ${
                          starsCount >= 1
                            ? 'text-yellow-300 fill-yellow-400 drop-shadow animate-star-pop-1'
                            : 'text-slate-900/60 fill-slate-900/60'
                        }`}
                      />
                      <Star
                        className={`w-3 h-3 ${
                          starsCount >= 2
                            ? 'text-yellow-300 fill-yellow-400 drop-shadow animate-star-pop-2'
                            : 'text-slate-900/60 fill-slate-900/60'
                        }`}
                      />
                      <Star
                        className={`w-3 h-3 ${
                          starsCount >= 3
                            ? 'text-yellow-300 fill-yellow-400 drop-shadow animate-star-pop-3'
                            : 'text-slate-900/60 fill-slate-900/60'
                        }`}
                      />
                    </div>

                    {/* Completed Checkmark Badge */}
                    {starsCount > 0 && !isCurrent && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] text-slate-400">{level.id}</span>
                  </div>
                )}
              </button>
            </div>

            {/* Level Title Label */}
            <span className="mt-1 text-[10px] sm:text-[11px] font-black text-amber-200/90 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/20 whitespace-nowrap shadow">
              {level.name}
            </span>
          </div>
        );
      })}

      {/* Floating Fruit Inspection Toast */}
      {activeFruitToast && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-amber-950 border-2 border-amber-400 rounded-2xl px-4 py-2.5 shadow-2xl text-white text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
          style={{
            left: `${activeFruitToast.x}px`,
            top: `${activeFruitToast.y}px`,
          }}
        >
          <span className="text-2xl">{activeFruitToast.emoji}</span>
          <div>
            <div className="text-amber-300 font-black">{activeFruitToast.name}</div>
            <div className="text-[11px] text-amber-100/90 font-medium">
              {activeFruitToast.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
