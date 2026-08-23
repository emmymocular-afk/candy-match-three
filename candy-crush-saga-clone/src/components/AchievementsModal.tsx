import React, { useState } from 'react';
import { PlayerProgress } from '../types';
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  isAchievementCompleted,
  isAchievementClaimed,
  claimAchievementReward,
  hasUnclaimedAchievements,
} from '../utils/achievements';
import { Trophy, CheckCircle2, Award, Sparkles, X, Gift, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

interface AchievementsModalProps {
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onClose: () => void;
}

type CategoryFilter = 'ALL' | 'UNCLAIMED' | 'COMPLETED';

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const handleClaim = (achievementId: string) => {
    const res = claimAchievementReward(achievementId, progress);
    if (res) {
      sound.playVictory();
      onUpdateProgress(res.updatedProgress);
      setClaimedNotice(`Claimed reward for "${res.achievement.title}"! (+${res.reward.coins} Coins)`);
      setTimeout(() => setClaimedNotice(null), 3000);
    } else {
      sound.playInvalid();
    }
  };

  const handleClaimAll = () => {
    let currentProg = { ...progress };
    let claimedCount = 0;
    let totalCoinsGained = 0;

    ACHIEVEMENTS.forEach((ach) => {
      const res = claimAchievementReward(ach.id, currentProg);
      if (res) {
        currentProg = res.updatedProgress;
        claimedCount++;
        totalCoinsGained += res.reward.coins;
      }
    });

    if (claimedCount > 0) {
      sound.playVictory();
      onUpdateProgress(currentProg);
      setClaimedNotice(`Claimed ${claimedCount} achievements! (+${totalCoinsGained} Coins)`);
      setTimeout(() => setClaimedNotice(null), 3500);
    } else {
      sound.playInvalid();
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const completed = isAchievementCompleted(ach, progress);
    const claimed = isAchievementClaimed(ach.id, progress);

    if (filter === 'UNCLAIMED') {
      return completed && !claimed;
    }
    if (filter === 'COMPLETED') {
      return completed;
    }
    return true;
  });

  const unclaimedAvailable = hasUnclaimedAchievements(progress);

  const categoryColor = (category: string) => {
    switch (category) {
      case 'jelly':
        return 'from-cyan-500/20 to-blue-600/20 border-cyan-400/40 text-cyan-300';
      case 'score':
        return 'from-amber-500/20 to-yellow-600/20 border-amber-400/40 text-amber-300';
      case 'stars':
        return 'from-yellow-400/20 to-amber-500/20 border-yellow-300/40 text-yellow-200';
      case 'level':
        return 'from-pink-500/20 to-rose-600/20 border-pink-400/40 text-pink-300';
      case 'special':
        return 'from-purple-500/20 to-fuchsia-600/20 border-purple-400/40 text-purple-300';
      default:
        return 'from-emerald-500/20 to-teal-600/20 border-emerald-400/40 text-emerald-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#2D1B4D] border-2 border-purple-400/40 rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide flex items-center gap-2">
                ACHIEVEMENTS
              </h2>
              <p className="text-xs text-purple-200/80 font-medium">
                Complete milestones & earn epic badges and sweet rewards!
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

        {/* Claim Notice Banner */}
        {claimedNotice && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-bold text-xs flex items-center justify-between animate-bounce">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              {claimedNotice}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        {/* Filter Controls & Claim All Button */}
        <div className="flex items-center justify-between my-4 gap-2">
          <div className="flex gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                filter === 'ALL'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              All ({ACHIEVEMENTS.length})
            </button>
            <button
              onClick={() => setFilter('UNCLAIMED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                filter === 'UNCLAIMED'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Ready
              {unclaimedAvailable && (
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                filter === 'COMPLETED'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Unlocked
            </button>
          </div>

          {unclaimedAvailable && (
            <button
              onClick={handleClaimAll}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/40 hover:scale-105 transition active:scale-95 flex items-center gap-1 animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              Claim All
            </button>
          )}
        </div>

        {/* Achievements Scroll List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-[250px]">
          {filteredAchievements.map((ach) => {
            const currentVal = getAchievementProgress(ach, progress);
            const isCompleted = isAchievementCompleted(ach, progress);
            const isClaimed = isAchievementClaimed(ach.id, progress);
            const percent = Math.min(100, Math.floor((currentVal / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`relative rounded-2xl p-3.5 border bg-gradient-to-r ${categoryColor(
                  ach.category
                )} backdrop-blur-xs flex items-center justify-between gap-3 shadow-lg transition-all hover:border-white/40`}
              >
                {/* Badge Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/20 flex items-center justify-center text-2xl shadow-md">
                    {ach.badgeEmoji}
                  </div>
                  {isClaimed && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white shadow">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-white truncate">{ach.title}</h3>
                    <span className="text-[10px] font-black text-purple-200 uppercase bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                      {ach.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200/80 font-medium leading-tight mt-0.5">
                    {ach.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2.5 w-full">
                    <div className="flex justify-between text-[10px] font-bold text-purple-200 mb-0.5">
                      <span>Progress</span>
                      <span>
                        {currentVal.toLocaleString()} / {ach.targetValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden p-0.5 border border-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Reward & Claim Button */}
                <div className="flex flex-col items-end justify-center gap-1.5 flex-shrink-0 pl-1 border-l border-white/10">
                  <div className="flex items-center gap-1 text-xs font-black text-yellow-300">
                    <span>🍬</span>
                    <span>+{ach.reward.coins}</span>
                  </div>

                  {ach.reward.boosters && (
                    <div className="text-[10px] font-bold text-pink-200 flex items-center gap-0.5">
                      <span>🔨</span>
                      <span>+1 Booster</span>
                    </div>
                  )}

                  {isClaimed ? (
                    <div className="px-2.5 py-1 rounded-xl bg-white/10 text-slate-400 font-bold text-[10px] border border-white/10">
                      Claimed
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(ach.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/50 transition transform hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      CLAIM
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 text-purple-300 font-bold text-[10px] border border-white/5 opacity-70">
                      {percent}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAchievements.length === 0 && (
            <div className="py-12 text-center text-purple-200/60 text-xs font-medium">
              No achievements found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
