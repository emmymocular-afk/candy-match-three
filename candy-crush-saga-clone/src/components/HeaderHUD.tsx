import React from 'react';
import { LevelConfig, TargetObjective, ProfileBadge } from '../types';
import { sound } from '../utils/sound';
import { getWorldThemeByLevelId, getWorldThemeByName } from '../utils/worldThemes';
import {
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Pause,
  MapPin,
  Star,
  Target,
  Sparkles,
  Award,
  Trophy,
  BarChart2,
  Calendar,
  Gift,
  Flame,
  ShieldAlert,
} from 'lucide-react';

interface HeaderHUDProps {
  level: LevelConfig;
  score: number;
  movesLeft: number;
  jellyLeft: number;
  ingredientsLeft: number;
  collectedColors: Record<string, number>;
  onOpenMap: () => void;
  onPause: () => void;
  onOpenAudioSettings?: () => void;
  onOpenAchievements?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAnalytics?: () => void;
  onOpenMissions?: () => void;
  onOpenDailySpin?: () => void;
  onOpenDailyStreak?: () => void;
  onOpenWeeklyChallenges?: () => void;
  hasUnclaimed?: boolean;
  hasUnclaimedMissions?: boolean;
  hasFreeSpin?: boolean;
  hasStreakClaim?: boolean;
  hasWeeklyClaim?: boolean;
  equippedBadge?: ProfileBadge | null;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  level,
  score,
  movesLeft,
  jellyLeft,
  ingredientsLeft,
  collectedColors,
  onOpenMap,
  onPause,
  onOpenAudioSettings,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenAnalytics,
  onOpenMissions,
  onOpenDailySpin,
  onOpenDailyStreak,
  onOpenWeeklyChallenges,
  hasUnclaimed,
  hasUnclaimedMissions,
  hasFreeSpin,
  hasStreakClaim,
  hasWeeklyClaim,
  equippedBadge,
}) => {
  const [soundOn, setSoundOn] = React.useState(sound.isSoundEnabled());
  const [bgmOn, setBgmOn] = React.useState(sound.isBgmEnabled());

  const handleToggleSound = () => {
    setSoundOn(sound.toggleSound());
  };

  const handleToggleBgm = () => {
    setBgmOn(sound.toggleBgm());
  };

  const star1 = level.starScores[0];
  const star2 = level.starScores[1];
  const star3 = level.starScores[2];

  const currentStars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
  const maxScore = star3 * 1.1;
  const scorePercent = Math.min(100, Math.floor((score / maxScore) * 100));

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2 select-none">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between text-white">
        <button
          onClick={onOpenMap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/30 text-xs font-bold transition shadow-md"
        >
          <MapPin className="w-4 h-4 text-purple-300" />
          Map
        </button>

        {(() => {
          const theme = getWorldThemeByLevelId(level.id);
          return (
            <div className="text-center flex flex-col items-center">
              <div className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-black tracking-wider flex items-center justify-center gap-1 shadow-sm ${theme.headerBadge}`}>
                {equippedBadge && (
                  <span className="text-xs" title={equippedBadge.name}>
                    {equippedBadge.icon}
                  </span>
                )}
                <span>{theme.emoji} {level.worldName}</span>
              </div>
              <div className="text-sm font-extrabold text-amber-200 drop-shadow-sm mt-0.5">
                Level {level.id}: {level.name}
              </div>
            </div>
          );
        })()}

        <div className="flex items-center gap-1.5">
          {onOpenWeeklyChallenges && (
            <button
              onClick={onOpenWeeklyChallenges}
              className="relative p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs transition"
              title="Weekly Challenges"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              {hasWeeklyClaim && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-[#2D1B4D] animate-ping" />
              )}
            </button>
          )}
          {onOpenDailyStreak && (
            <button
              onClick={onOpenDailyStreak}
              className="relative p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-orange-300 text-xs transition"
              title="Daily Streak"
            >
              <Flame className="w-4 h-4 text-orange-300" />
              {hasStreakClaim && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#2D1B4D] animate-ping" />
              )}
            </button>
          )}
          {onOpenDailySpin && (
            <button
              onClick={onOpenDailySpin}
              className="relative p-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs transition"
              title="Lucky Wheel"
            >
              <Gift className="w-4 h-4 text-pink-300" />
              {hasFreeSpin && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-400 border border-[#2D1B4D] animate-ping" />
              )}
            </button>
          )}
          {onOpenMissions && (
            <button
              onClick={onOpenMissions}
              className="relative p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs transition"
              title="Daily Missions"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              {hasUnclaimedMissions && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#2D1B4D] animate-ping" />
              )}
            </button>
          )}
          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs transition"
              title="Player Analytics (D3 Chart)"
            >
              <BarChart2 className="w-4 h-4 text-purple-300" />
            </button>
          )}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs transition"
              title="Level Leaderboard"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
            </button>
          )}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="relative p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs transition"
              title="Achievements"
            >
              <Award className="w-4 h-4 text-yellow-300" />
              {hasUnclaimed && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 border border-[#2D1B4D] animate-ping" />
              )}
            </button>
          )}
          {onOpenAudioSettings ? (
            <button
              onClick={onOpenAudioSettings}
              className="p-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500/90 border border-purple-300/40 text-amber-200 text-xs transition shadow-md flex items-center gap-1"
              title="Audio Settings"
            >
              <Sliders className="w-4 h-4 text-amber-300" />
            </button>
          ) : (
            <>
              <button
                onClick={handleToggleSound}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/30 text-slate-200 text-xs transition"
                title="Toggle Sound Effects"
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                onClick={handleToggleBgm}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/30 text-slate-200 text-xs transition"
                title="Toggle Background Music"
              >
                <Music className={`w-4 h-4 ${bgmOn ? 'text-pink-400 animate-pulse' : 'text-slate-400'}`} />
              </button>
            </>
          )}
          <button
            onClick={onPause}
            className="p-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500/90 text-white transition shadow-sm"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Row: Moves & Objectives */}
      <div className="grid grid-cols-12 gap-2 items-stretch">
        {/* Moves Left Counter */}
        <div className="col-span-4 bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-2 flex flex-col items-center justify-center border-2 border-pink-300/40 shadow-lg shadow-pink-900/30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-100/90">Moves</span>
          <span className={`text-2xl font-black text-white ${movesLeft <= 5 ? 'animate-bounce text-yellow-300' : ''}`}>
            {movesLeft}
          </span>
        </div>

        {/* Level Objectives Card */}
        <div className="col-span-8 bg-slate-900/80 backdrop-blur-md rounded-2xl p-2.5 border border-slate-700/60 flex items-center justify-around text-white shadow-md">
          <ObjectiveDisplay
            objective={level.objective}
            score={score}
            jellyLeft={jellyLeft}
            ingredientsLeft={ingredientsLeft}
            collectedColors={collectedColors}
          />
        </div>
      </div>

      {/* Star Progress Bar */}
      <div className="relative w-full h-4 bg-slate-800/80 rounded-full border border-slate-700 overflow-hidden shadow-inner flex items-center">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500 rounded-full shadow-md"
          style={{ width: `${scorePercent}%` }}
        />

        {/* Star Markers */}
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
          <StarMarker thresholdPercent={(star1 / maxScore) * 100} earned={currentStars >= 1} />
          <StarMarker thresholdPercent={(star2 / maxScore) * 100} earned={currentStars >= 2} />
          <StarMarker thresholdPercent={(star3 / maxScore) * 100} earned={currentStars >= 3} />
        </div>
      </div>

      {/* Score Text */}
      <div className="flex justify-between items-center text-xs font-extrabold text-slate-300 px-1">
        <span>Score: <strong className="text-yellow-400 text-sm">{score.toLocaleString()}</strong></span>
        <span>Goal: <strong className="text-pink-300">{star1.toLocaleString()}</strong></span>
      </div>
    </div>
  );
};

const ObjectiveDisplay: React.FC<{
  objective: TargetObjective;
  score: number;
  jellyLeft: number;
  ingredientsLeft: number;
  collectedColors: Record<string, number>;
}> = ({ objective, score, jellyLeft, ingredientsLeft, collectedColors }) => {
  if (objective.type === 'score') {
    const target = objective.targetScore || 1000;
    const isMet = score >= target;
    return (
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-400" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Reach Score</span>
          <span className={`text-xs font-black ${isMet ? 'text-emerald-400' : 'text-amber-200'}`}>
            {score} / {target}
          </span>
        </div>
      </div>
    );
  }

  if (objective.type === 'jelly') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-pink-500/30 border border-pink-400/60 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Clear Jelly</span>
          <span className={`text-xs font-black ${jellyLeft === 0 ? 'text-emerald-400' : 'text-pink-300'}`}>
            {jellyLeft} Remaining
          </span>
        </div>
      </div>
    );
  }

  if (objective.type === 'ingredients') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-amber-500/30 border border-amber-400/60 flex items-center justify-center">
          <span className="text-xs">🍒</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Bring Down</span>
          <span className={`text-xs font-black ${ingredientsLeft === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
            {ingredientsLeft} Left
          </span>
        </div>
      </div>
    );
  }

  if (objective.type === 'color-collect' && objective.collectColors) {
    return (
      <div className="flex items-center gap-3">
        {Object.entries(objective.collectColors).map(([color, targetCount]) => {
          const current = collectedColors[color] || 0;
          const isDone = current >= targetCount;
          return (
            <div key={color} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full bg-${color}-500 inline-block border border-white/40`} />
              <span className={`text-xs font-black ${isDone ? 'text-emerald-400' : 'text-slate-200'}`}>
                {current}/{targetCount}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

const StarMarker: React.FC<{ thresholdPercent: number; earned: boolean }> = ({ thresholdPercent, earned }) => {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ left: `${Math.min(92, Math.max(5, thresholdPercent))}%` }}
    >
      <Star
        className={`w-4 h-4 transition-all duration-300 ${
          earned
            ? 'text-yellow-300 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] scale-125'
            : 'text-slate-600 fill-slate-700'
        }`}
      />
    </div>
  );
};
