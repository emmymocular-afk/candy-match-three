import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  WeeklyChallenge,
  WeeklyChallengesData,
  ProfileBadge,
} from '../types';
import {
  getTimeUntilWeeklyReset,
  ALL_PROFILE_BADGES,
} from '../utils/weeklyChallenges';
import { sound } from '../utils/sound';
import {
  X,
  Trophy,
  CheckCircle2,
  Gift,
  Sparkles,
  Clock,
  Coins,
  Shield,
  Crown,
  Award,
  Flame,
  Star,
} from 'lucide-react';

interface WeeklyChallengesModalProps {
  challengesData: WeeklyChallengesData;
  onClaimChallenge: (challengeId: string) => void;
  onEquipBadge: (badgeId: string | undefined) => void;
  onClose: () => void;
}

export const WeeklyChallengesModal: React.FC<WeeklyChallengesModalProps> = ({
  challengesData,
  onClaimChallenge,
  onEquipBadge,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'badges'>('challenges');
  const [timeLeft, setTimeLeft] = useState(getTimeUntilWeeklyReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilWeeklyReset());
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const unlockedBadgeIds = challengesData.unlockedBadgeIds || [];
  const equippedBadgeId = challengesData.equippedBadgeId;
  const equippedBadge = equippedBadgeId ? ALL_PROFILE_BADGES[equippedBadgeId] : null;

  const handleClaim = (challenge: WeeklyChallenge) => {
    sound.playVictory();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
    onClaimChallenge(challenge.id);
  };

  const allClaimed = challengesData.challenges.every((c) => c.isClaimed);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#211138] border-2 border-amber-400/50 rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black">
              <Trophy className="w-7 h-7 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide flex items-center gap-1.5">
                WEEKLY CHALLENGES
              </h2>
              <p className="text-xs text-purple-200/80 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Resets in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10 my-3 gap-1 relative z-10">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('challenges');
            }}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'challenges'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md'
                : 'text-purple-200/80 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Active Challenges ({challengesData.challenges.filter((c) => !c.isClaimed).length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('badges');
            }}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md'
                : 'text-purple-200/80 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Profile Badges ({unlockedBadgeIds.length}/{Object.keys(ALL_PROFILE_BADGES).length})
          </button>
        </div>

        {/* Tab 1: Active Weekly Challenges */}
        {activeTab === 'challenges' && (
          <div className="flex-1 overflow-y-auto my-1 pr-1 flex flex-col gap-3 custom-scrollbar relative z-10">
            {challengesData.challenges.map((challenge) => {
              const pct = Math.min(100, Math.floor((challenge.current / challenge.target) * 100));

              return (
                <div
                  key={challenge.id}
                  className={`relative rounded-2xl p-4 border transition-all flex flex-col gap-3 ${
                    challenge.isClaimed
                      ? 'bg-slate-900/40 border-white/5 opacity-70'
                      : challenge.isCompleted
                      ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-purple-900/50 border-amber-300/90 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40'
                      : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Row: Icon, Title & Description */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-3xl p-2 bg-white/5 rounded-2xl flex-shrink-0 border border-white/10">
                        {challenge.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm sm:text-base text-amber-100 truncate">
                            {challenge.title}
                          </h3>
                        </div>
                        <p className="text-xs text-purple-200/80 line-clamp-2 mt-0.5">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Rare Reward Preview Badge */}
                    {challenge.rewardBadge && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-pink-400/50 px-2.5 py-1 rounded-xl flex-shrink-0 text-right">
                        <span className="text-base">{challenge.rewardBadge.icon}</span>
                        <div className="text-left">
                          <span className="text-[9px] uppercase text-pink-300 font-extrabold block">
                            UNIQUE BADGE
                          </span>
                          <span className="text-[10px] font-black text-white block truncate max-w-[90px]">
                            {challenge.rewardBadge.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rewards Row (Coins & Booster Bundles) */}
                  <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/5 text-xs">
                    <span className="text-[10px] font-black text-purple-300/80 uppercase tracking-wider">
                      REWARDS:
                    </span>
                    <div className="flex items-center gap-1 text-yellow-300 font-black">
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                      +{challenge.rewardCoins}
                    </div>
                    {challenge.rewardBoosters && (
                      <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                        {challenge.rewardBoosters.hammer && (
                          <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            +{challenge.rewardBoosters.hammer} 🔨
                          </span>
                        )}
                        {challenge.rewardBoosters.freeSwap && (
                          <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            +{challenge.rewardBoosters.freeSwap} 🖐️
                          </span>
                        )}
                        {challenge.rewardBoosters.stripedStart && (
                          <span className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            +{challenge.rewardBoosters.stripedStart} ⚡
                          </span>
                        )}
                        {challenge.rewardBoosters.colorBombStart && (
                          <span className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            +{challenge.rewardBoosters.colorBombStart} 🌈
                          </span>
                        )}
                        {challenge.rewardBoosters.extraMoves && (
                          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            +{challenge.rewardBoosters.extraMoves} ➕
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar & Claim Button */}
                  <div className="flex items-center justify-between gap-3 mt-0.5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-200/90 mb-1">
                        <span>Weekly Progress</span>
                        <span className="font-mono text-amber-300">
                          {challenge.current.toLocaleString()} / {challenge.target.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3.5 bg-slate-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            challenge.isCompleted
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-md shadow-amber-400'
                              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {challenge.isClaimed ? (
                      <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CLAIMED
                      </div>
                    ) : challenge.isCompleted ? (
                      <button
                        onClick={() => handleClaim(challenge)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition flex items-center gap-1.5 flex-shrink-0 animate-pulse"
                      >
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        CLAIM REWARDS
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5 text-purple-300/70 font-semibold text-xs flex-shrink-0">
                        IN PROGRESS
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Profile Badges Gallery */}
        {activeTab === 'badges' && (
          <div className="flex-1 overflow-y-auto my-1 pr-1 flex flex-col gap-3 custom-scrollbar relative z-10">
            {/* Currently Equipped Badge Banner */}
            <div className="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl">
                  {equippedBadge ? equippedBadge.icon : '🛡️'}
                </div>
                <div>
                  <span className="text-[10px] text-amber-300/80 uppercase font-black tracking-wider block">
                    EQUIPPED PROFILE BADGE
                  </span>
                  <span className="text-sm font-black text-white">
                    {equippedBadge ? equippedBadge.name : 'None Equipped'}
                  </span>
                </div>
              </div>

              {equippedBadge && (
                <button
                  onClick={() => {
                    sound.playPop();
                    onEquipBadge(undefined);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 text-xs font-bold transition"
                >
                  Unequip
                </button>
              )}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(ALL_PROFILE_BADGES).map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                const isEquipped = equippedBadgeId === badge.id;

                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-3 border transition-all flex flex-col justify-between gap-2 ${
                      isEquipped
                        ? 'bg-gradient-to-r from-amber-500/30 to-purple-900/60 border-amber-300 ring-2 ring-amber-400/50 shadow-lg'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-purple-400/40 hover:border-purple-300'
                        : 'bg-slate-950/50 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.bgGradient} border ${badge.borderColor} flex items-center justify-center text-2xl shadow-md shrink-0`}
                      >
                        {badge.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                            {badge.name}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30 font-bold shrink-0">
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full border border-white/10 font-bold shrink-0">
                              LOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-purple-200/80 line-clamp-2 mt-0.5">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-1 flex items-center justify-end">
                      {isUnlocked ? (
                        isEquipped ? (
                          <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-amber-400" /> EQUIPPED
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sound.playVictory();
                              onEquipBadge(badge.id);
                            }}
                            className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition"
                          >
                            Equip Badge
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium italic">
                          Earn via Weekly Challenges
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Summary Banner */}
        <div className="mt-2 p-2.5 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-purple-200/80 relative z-10">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Complete weekly challenges for heavy booster bundles & profile badges!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
