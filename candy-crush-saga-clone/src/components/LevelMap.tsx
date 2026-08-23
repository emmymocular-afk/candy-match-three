import React, { useState } from 'react';
import { PlayerProgress, LevelConfig } from '../types';
import { getLevelConfig, LEVELS } from '../utils/levels';
import { hasUnclaimedAchievements } from '../utils/achievements';
import { hasUnclaimedMissions } from '../utils/dailyMissions';
import { isFreeSpinAvailable } from '../utils/luckyWheel';
import { getStreakInfo } from '../utils/dailyStreak';
import { hasUnclaimedWeeklyChallenges, ALL_PROFILE_BADGES } from '../utils/weeklyChallenges';
import {
  Star,
  Lock,
  Play,
  Gift,
  ShoppingBag,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  CheckCircle2,
  Award,
  Crown,
  Boxes,
  Zap,
  BarChart2,
  Calendar,
  Flame,
  Sliders,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { WORLD_THEMES_CONFIG, WorldThemeConfig, getWorldThemeByLevelId } from '../utils/worldThemes';
import { WorldAmbientEffect } from './WorldAmbientEffect';
import { DirtRoadLandscape } from './DirtRoadLandscape';

interface LevelMapProps {
  progress: PlayerProgress;
  onSelectLevel: (levelConfig: LevelConfig) => void;
  onOpenDailySpin: () => void;
  onOpenDailyStreak?: () => void;
  onOpenWeeklyChallenges?: () => void;
  onOpenShop: () => void;
  onOpenAudioSettings?: () => void;
  onOpenAchievements?: () => void;
  onOpenLeaderboard?: (levelId?: number) => void;
  onOpenAnalytics?: () => void;
  onOpenMissions?: () => void;
  onClaimWorldChest?: (worldName: string, coins: number) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  progress,
  onSelectLevel,
  onOpenDailySpin,
  onOpenDailyStreak,
  onOpenWeeklyChallenges,
  onOpenShop,
  onOpenAudioSettings,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenAnalytics,
  onOpenMissions,
  onClaimWorldChest,
}) => {
  const [selectedLevelModal, setSelectedLevelModal] = useState<LevelConfig | null>(null);
  const [soundActive, setSoundActive] = useState(() => sound.isSoundEnabled());
  const [bgmActive, setBgmActive] = useState(() => sound.isBgmEnabled());
  const [claimedChests, setClaimedChests] = useState<Record<string, boolean>>(
    progress.claimedWorldChests || {}
  );
  const [chestModalReward, setChestModalReward] = useState<{ worldName: string; coins: number } | null>(null);

  const totalStarsEarned = (Object.values(progress.stars) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);

  const currentTheme = getWorldThemeByLevelId(progress.unlockedLevel);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundActive(newState);
  };

  const handleToggleBgm = () => {
    const newState = sound.toggleBgm();
    setBgmActive(newState);
  };

  const handleNodeClick = (levelId: number) => {
    if (levelId > progress.unlockedLevel) {
      sound.playInvalid();
      return;
    }
    sound.playPop();
    const config = getLevelConfig(levelId);
    setSelectedLevelModal(config);
  };

  const handleClaimChest = (world: WorldThemeConfig) => {
    if (claimedChests[world.id]) return;

    sound.playVictory();
    const coinsReward = 150;
    const newClaimed = { ...claimedChests, [world.id]: true };
    setClaimedChests(newClaimed);

    if (onClaimWorldChest) {
      onClaimWorldChest(world.name, coinsReward);
    }
    setChestModalReward({ worldName: world.name, coins: coinsReward });
  };

  return (
    <div className={`relative w-full min-h-screen bg-gradient-to-b ${currentTheme.mapBgGradient} text-white flex flex-col items-center overflow-y-auto pb-24 transition-colors duration-500`}>
      {/* Dynamic World Ambient Effect Overlay */}
      <WorldAmbientEffect effectType={currentTheme.gameAmbientEffect} />

      {/* Top Floating HUD Bar (Artistic Flair Theme) */}
      <header className="sticky top-3 z-40 w-full max-w-lg px-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[22px] px-4 py-2.5 flex items-center justify-between shadow-2xl shadow-purple-950/80">
          <div className="flex items-center gap-2">
            {/* Stars Count */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-black text-amber-200">{totalStarsEarned} Stars</span>
            </div>

            {/* Coins Count */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/40">
              <span className="text-xs">🍬</span>
              <span className="text-xs font-black text-yellow-300">{progress.coins}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 transition"
              title="Toggle Sound Effects"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            </button>

            <button
              onClick={handleToggleBgm}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 transition"
              title="Toggle Background Music"
            >
              <Music className={`w-4 h-4 ${bgmActive ? 'text-pink-400 animate-pulse' : 'text-slate-400'}`} />
            </button>

            {onOpenLeaderboard && (
              <button
                onClick={() => onOpenLeaderboard(progress.unlockedLevel)}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-300 font-black text-xs transition transform hover:scale-105 active:scale-95"
                title="Leaderboard"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
              </button>
            )}

            {onOpenAnalytics && (
              <button
                onClick={onOpenAnalytics}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 hover:bg-purple-500/30 text-purple-200 font-black text-xs transition transform hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Player Analytics (D3 Chart)"
              >
                <BarChart2 className="w-4 h-4 text-purple-300" />
              </button>
            )}

            {onOpenDailyStreak && (
              <button
                onClick={onOpenDailyStreak}
                className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 hover:bg-orange-500/30 text-orange-200 font-extrabold text-xs transition transform hover:scale-105 active:scale-95"
                title="Daily Login Streak"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Streak</span>
                {getStreakInfo(progress.dailyStreak).canClaimToday && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-[#2D1B4D] animate-bounce" />
                )}
              </button>
            )}

            {onOpenWeeklyChallenges && (
              <button
                onClick={onOpenWeeklyChallenges}
                className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-200 font-extrabold text-xs transition transform hover:scale-105 active:scale-95"
                title="Weekly Challenges"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Weekly</span>
                {hasUnclaimedWeeklyChallenges(progress.weeklyChallenges) && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-[#2D1B4D] animate-bounce" />
                )}
              </button>
            )}

            {onOpenMissions && (
              <button
                onClick={onOpenMissions}
                className="relative p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-300 font-black text-xs transition transform hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Daily Missions"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                {hasUnclaimedMissions(progress.dailyMissions) && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#2D1B4D] animate-bounce" />
                )}
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="relative p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-300 font-black text-xs transition transform hover:scale-105 active:scale-95"
                title="Achievements"
              >
                <Award className="w-4 h-4 text-yellow-300" />
                {hasUnclaimedAchievements(progress) && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-[#2D1B4D] animate-bounce" />
                )}
              </button>
            )}

            <button
              onClick={onOpenDailySpin}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF416C] to-[#B91D47] hover:brightness-110 text-white font-extrabold text-xs shadow-md shadow-pink-900/50 transition transform hover:scale-105 active:scale-95"
            >
              <Gift className="w-4 h-4" />
              Spin
              {isFreeSpinAvailable(progress.lastSpinDate) && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-300 border-2 border-[#2D1B4D] animate-bounce" />
              )}
            </button>

            <button
              onClick={onOpenShop}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition transform hover:scale-105 active:scale-95"
              title="Shop"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {onOpenAudioSettings && (
              <button
                onClick={onOpenAudioSettings}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 border border-purple-300/40 text-amber-200 font-black text-xs shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Audio Settings"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Title Section */}
      <div className="relative z-10 w-full max-w-lg text-center pt-6 pb-4 px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-pink-200 mb-2 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>SAGA MAP PROGRESSION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          CANDY CRUSH SAGA
        </h1>
        <p className="text-xs text-purple-200/80 font-medium mt-1">
          Journey through sweet worlds & unlock epic puzzles!
        </p>
      </div>

      {/* Visual Dirt Road Adventure Map Flanked by Mountains, Rivers, Trees & Fruit Plants */}
      <main className="relative z-10 w-full max-w-lg px-2 sm:px-4 pb-12">
        <DirtRoadLandscape
          progress={progress}
          onSelectLevel={(cfg) => setSelectedLevelModal(cfg)}
          claimedChests={claimedChests}
          onClaimChest={handleClaimChest}
        />
      </main>

      {/* Level Preview / Launch Modal */}
      {selectedLevelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#2D1B4D] border-2 border-purple-400/40 rounded-[28px] p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#FF416C] via-pink-500 to-amber-400 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-pink-900/50 border-2 border-white/30">
              {selectedLevelModal.id}
            </div>

            <div>
              <h2 className="text-2xl font-black text-amber-200 tracking-wide">{selectedLevelModal.name}</h2>
              <p className="text-xs text-purple-300 uppercase font-bold tracking-widest mt-0.5">
                🏰 {selectedLevelModal.worldName}
              </p>
            </div>

            {/* Level Requirements Frame */}
            <div className="w-full bg-white/10 rounded-2xl p-3.5 border border-white/15 flex flex-col gap-2.5 text-xs text-purple-100">
              <div className="flex justify-between font-bold">
                <span className="text-purple-300">Moves Allowed:</span>
                <span className="text-pink-300 font-black">{selectedLevelModal.moves} Moves</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-purple-300">Objective:</span>
                <span className="text-amber-300 font-black uppercase">
                  {selectedLevelModal.objective.type === 'score' && `Target ${selectedLevelModal.starScores[0]} Pts`}
                  {selectedLevelModal.objective.type === 'jelly' && `Clear ${selectedLevelModal.objective.jellyCount} Jelly`}
                  {selectedLevelModal.objective.type === 'ingredients' && `Drop ${selectedLevelModal.objective.ingredientsCount} Ingredients`}
                  {selectedLevelModal.objective.type === 'color-collect' && `Collect Colors`}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-purple-300">3-Star Goal:</span>
                <span className="text-yellow-300 font-black">
                  {selectedLevelModal.starScores[2].toLocaleString()} Pts
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 w-full mt-2">
              {onOpenLeaderboard && (
                <button
                  onClick={() => {
                    const levelId = selectedLevelModal.id;
                    setSelectedLevelModal(null);
                    onOpenLeaderboard(levelId);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  View Level Leaderboard
                </button>
              )}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setSelectedLevelModal(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 font-bold text-xs transition border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const cfg = selectedLevelModal;
                    setSelectedLevelModal(null);
                    onSelectLevel(cfg);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/40 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  PLAY!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* World Chest Reward Claim Modal */}
      {chestModalReward && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#2D1B4D] border-2 border-amber-400/50 rounded-[28px] p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/50 border-4 border-amber-200 animate-bounce">
              🎁
            </div>

            <div>
              <h2 className="text-2xl font-black text-amber-200 tracking-wide">WORLD COMPLETED!</h2>
              <p className="text-xs text-purple-200 font-medium mt-1">
                You mastered all stars in <span className="font-bold text-amber-300">{chestModalReward.worldName}</span>!
              </p>
            </div>

            <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-4 w-full flex items-center justify-center gap-3">
              <span className="text-2xl">🍬</span>
              <span className="text-2xl font-black text-yellow-300">+{chestModalReward.coins} Coins</span>
            </div>

            <button
              onClick={() => setChestModalReward(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 transition transform hover:scale-105 active:scale-95"
            >
              SWEET REWARD!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
