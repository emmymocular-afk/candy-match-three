import React, { useState } from 'react';
import { PlayerProgress } from '../types';
import { getLevelConfig, LEVELS } from '../utils/levels';
import { getLevelLeaderboard } from '../utils/leaderboard';
import { Trophy, Medal, Sparkles, X, ChevronLeft, ChevronRight, Play, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface LeaderboardModalProps {
  progress: PlayerProgress;
  defaultLevelId?: number;
  onSelectLevelToPlay?: (levelId: number) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  progress,
  defaultLevelId = 1,
  onSelectLevelToPlay,
  onClose,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(
    Math.min(defaultLevelId, LEVELS.length)
  );

  const levelConfig = getLevelConfig(selectedLevelId);
  const playerScore = progress.highScores[selectedLevelId] || 0;
  const leaderboard = getLevelLeaderboard(selectedLevelId, playerScore);

  const playerRank = leaderboard.find((e) => e.isPlayer)?.rank;
  const top1Score = leaderboard[0]?.score || 0;

  const handlePrevLevel = () => {
    if (selectedLevelId > 1) {
      sound.playPop();
      setSelectedLevelId(selectedLevelId - 1);
    }
  };

  const handleNextLevel = () => {
    if (selectedLevelId < Math.min(progress.unlockedLevel + 1, LEVELS.length)) {
      sound.playPop();
      setSelectedLevelId(selectedLevelId + 1);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: '🥇',
          bg: 'from-amber-400 to-yellow-300 text-slate-950 border-yellow-200 shadow-amber-500/50',
          pill: 'bg-amber-400 text-slate-950',
        };
      case 2:
        return {
          icon: '🥈',
          bg: 'from-slate-300 to-slate-400 text-slate-950 border-slate-100 shadow-slate-400/40',
          pill: 'bg-slate-300 text-slate-950',
        };
      case 3:
        return {
          icon: '🥉',
          bg: 'from-amber-700 to-amber-600 text-amber-100 border-amber-500/60 shadow-amber-800/40',
          pill: 'bg-amber-700 text-white',
        };
      default:
        return {
          icon: `#${rank}`,
          bg: 'from-slate-800 to-slate-900 text-slate-300 border-slate-700',
          pill: 'bg-slate-800 text-slate-400',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#2B1745] border-2 border-amber-400/50 rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide flex items-center gap-1.5">
                TOP 5 LEADERBOARD
              </h2>
              <p className="text-xs text-purple-200/80 font-medium">
                Local high scores for Level {selectedLevelId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center justify-between my-3 px-3 py-2 bg-slate-900/80 rounded-2xl border border-white/10">
          <button
            onClick={handlePrevLevel}
            disabled={selectedLevelId <= 1}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Level {selectedLevelId}: {levelConfig.name}
            </div>
            <div className="text-[10px] text-purple-200/70 font-medium">
              {levelConfig.worldName}
            </div>
          </div>

          <button
            onClick={handleNextLevel}
            disabled={selectedLevelId >= Math.min(progress.unlockedLevel, LEVELS.length)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Entries List */}
        <div className="flex-1 overflow-y-auto my-1 flex flex-col gap-2.5 pr-0.5">
          {leaderboard.map((entry) => {
            const badge = getRankBadge(entry.rank);

            return (
              <div
                key={entry.id}
                className={`relative rounded-2xl p-3 border flex items-center justify-between gap-3 transition-all ${
                  entry.isPlayer
                    ? 'bg-gradient-to-r from-amber-500/25 via-pink-500/20 to-purple-600/30 border-amber-300 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Rank Badge & Avatar */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${badge.bg} border flex items-center justify-center font-black text-sm shadow-md flex-shrink-0`}
                  >
                    {badge.icon}
                  </div>

                  <div className="text-2xl flex-shrink-0">{entry.avatar}</div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-white truncate">
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded-full bg-amber-400 text-slate-950">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-purple-200/70 font-semibold">
                      {entry.title}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-amber-300 font-mono">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-purple-200/60 font-bold uppercase">
                    Points
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Replay Encouragement Callout */}
        <div className="mt-3 p-3 bg-gradient-to-r from-purple-900/60 to-slate-900/80 rounded-2xl border border-amber-400/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
            <div className="text-xs">
              {playerScore === 0 ? (
                <p className="font-bold text-amber-200 truncate">
                  No record set yet! Beat <span className="text-white font-extrabold">{top1Score.toLocaleString()}</span> to grab 1st place!
                </p>
              ) : playerRank === 1 ? (
                <p className="font-bold text-emerald-300 truncate">
                  🏆 You hold 1st place on Level {selectedLevelId}! Supreme Sugar Legend!
                </p>
              ) : (
                <p className="font-bold text-amber-200 truncate">
                  You are #{playerRank}! Score <span className="text-white font-extrabold">{(top1Score - playerScore + 100).toLocaleString()}</span> more to claim #1!
                </p>
              )}
            </div>
          </div>

          {onSelectLevelToPlay && (
            <button
              onClick={() => {
                onSelectLevelToPlay(selectedLevelId);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/40 hover:scale-105 active:scale-95 transition flex items-center gap-1 flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              PLAY
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
