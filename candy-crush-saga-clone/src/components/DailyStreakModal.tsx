import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  STREAK_REWARDS,
  getStreakInfo,
  claimDailyStreakReward,
} from '../utils/dailyStreak';
import { getTimeUntilReset } from '../utils/dailyMissions';
import { DailyStreakData, DailyStreakReward } from '../types';
import { sound } from '../utils/sound';
import {
  Flame,
  X,
  Check,
  Lock,
  Sparkles,
  Crown,
  Gift,
  Clock,
  Trophy,
  Coins,
  ShieldAlert,
} from 'lucide-react';

interface DailyStreakModalProps {
  streakData?: DailyStreakData;
  onClose: () => void;
  onClaimReward: (
    updatedStreakData: DailyStreakData,
    reward: DailyStreakReward
  ) => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  streakData,
  onClose,
  onClaimReward,
}) => {
  const [info, setInfo] = useState(() => getStreakInfo(streakData));
  const [claimedReward, setClaimedReward] = useState<DailyStreakReward | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilReset());

  // Update countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    if (!info.canClaimToday) return;

    sound.playVictory();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    const result = claimDailyStreakReward(streakData);
    setClaimedReward(result.rewardClaimed);

    // Update local state
    setInfo(getStreakInfo(result.updatedStreakData));

    // Call parent handler
    onClaimReward(result.updatedStreakData, result.rewardClaimed);
  };

  const dayToClaimToday = info.nextDayToClaim;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#25133d] border-2 border-amber-400/50 rounded-[32px] p-5 sm:p-6 shadow-2xl text-center flex flex-col items-center gap-3 text-white overflow-hidden max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Background glow effects */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Streak Badges */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 animate-pulse">
              <Flame className="w-6 h-6 text-amber-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide uppercase">
              DAILY STREAK
            </h2>
          </div>
          <p className="text-xs text-purple-200/80 font-medium">
            Log in consecutive days to unlock bigger rewards!
          </p>
        </div>

        {/* Streak Counters Banner */}
        <div className="w-full flex items-center justify-between gap-2 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-2.5 px-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>Current Streak:</span>
            <span className="text-sm font-black text-white font-mono bg-orange-500/30 px-2 py-0.5 rounded-lg border border-orange-400/40">
              {info.currentStreak} Days
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-200/90">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Best:</span>
            <span className="font-mono text-white">{info.highestStreak} Days</span>
          </div>
        </div>

        {/* Streak Broken Warning Banner */}
        {info.isStreakBroken && !info.isClaimedToday && (
          <div className="w-full bg-amber-500/15 border border-amber-400/40 rounded-2xl p-2.5 flex items-center gap-2 text-xs text-amber-200 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Streak reset due to a missed day. Claim today to start fresh at Day 1!</span>
          </div>
        )}

        {/* Claimed Reward Banner */}
        {claimedReward && (
          <div className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-300/70 rounded-2xl p-3 text-center animate-in zoom-in-95 duration-200">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest block">
              🎉 REWARD CLAIMED!
            </span>
            <p className="text-sm font-black text-white mt-1">
              You earned <span className="text-yellow-300">+{claimedReward.coins} Coins</span>
              {claimedReward.boosters && Object.keys(claimedReward.boosters).length > 0 && (
                <span> & Boosters!</span>
              )}
            </p>
          </div>
        )}

        {/* 7-Day Rewards Calendar Grid */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-3 gap-2.5 my-1">
          {STREAK_REWARDS.map((item) => {
            const isMilestone = item.isMilestone;
            const dayNum = item.day;

            // Determine day card status
            // If we are currently on cycle day index:
            // - If claimed today, days <= info.currentStreak in current cycle are claimed.
            // - If not claimed today, days < dayToClaimToday are claimed, dayToClaimToday is ready, > dayToClaimToday are locked.

            let isClaimed = false;
            let isReady = false;

            if (info.isClaimedToday) {
              const currentCycleDay = ((info.currentStreak - 1) % 7) + 1;
              if (dayNum <= currentCycleDay) {
                isClaimed = true;
              }
            } else {
              const currentTargetDay = dayToClaimToday;
              if (dayNum < currentTargetDay) {
                isClaimed = true;
              } else if (dayNum === currentTargetDay) {
                isReady = true;
              }
            }

            // Custom grid span for Day 7 Grand Chest
            const spanClass = isMilestone ? 'col-span-3 sm:col-span-3' : 'col-span-1';

            return (
              <div
                key={dayNum}
                className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between transition-all duration-200 border ${spanClass} ${
                  isReady
                    ? 'bg-gradient-to-b from-amber-500/30 to-orange-600/30 border-amber-300 shadow-lg shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400 animate-pulse'
                    : isClaimed
                    ? 'bg-slate-900/60 border-emerald-500/40 opacity-80'
                    : 'bg-slate-900/40 border-white/10 opacity-70'
                }`}
              >
                {/* Header Badge */}
                <div className="w-full flex items-center justify-between gap-1 text-[11px] font-black tracking-wider uppercase mb-1">
                  <span className={isReady ? 'text-amber-300' : isClaimed ? 'text-emerald-400' : 'text-purple-300/80'}>
                    Day {dayNum}
                  </span>
                  {isClaimed ? (
                    <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  ) : isReady ? (
                    <span className="flex items-center gap-0.5 text-amber-200 text-[10px] bg-amber-500/40 px-1.5 py-0.5 rounded-full border border-amber-300 animate-bounce">
                      <Sparkles className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-purple-300/50" />
                  )}
                </div>

                {/* Reward Content */}
                <div className="flex flex-col items-center my-1 gap-1">
                  <span className={`text-2xl ${isMilestone ? 'text-3xl' : ''}`}>
                    {item.icon}
                  </span>
                  <div className="text-center">
                    <span className="text-xs font-black text-yellow-300 block">
                      +{item.coins} 🪙
                    </span>
                    {item.boosters && (
                      <div className="flex flex-wrap items-center justify-center gap-1 mt-0.5">
                        {item.boosters.hammer && (
                          <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1 rounded font-bold">
                            +{item.boosters.hammer} 🔨
                          </span>
                        )}
                        {item.boosters.freeSwap && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 rounded font-bold">
                            +{item.boosters.freeSwap} 🖐️
                          </span>
                        )}
                        {item.boosters.stripedStart && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1 rounded font-bold">
                            +{item.boosters.stripedStart} ⚡
                          </span>
                        )}
                        {item.boosters.colorBombStart && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1 rounded font-bold">
                            +{item.boosters.colorBombStart} 🌈
                          </span>
                        )}
                        {item.boosters.extraMoves && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">
                            +{item.boosters.extraMoves} ➕
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestone Day 7 Banner */}
                {isMilestone && (
                  <div className="w-full mt-1 bg-gradient-to-r from-amber-400/20 via-yellow-300/30 to-amber-400/20 rounded-xl p-1 text-[11px] font-black text-amber-200 border border-amber-400/30 flex items-center justify-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>GRAND MILESTONE CHEST!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action Button / Countdown */}
        <div className="w-full mt-2 flex flex-col gap-2">
          {info.canClaimToday ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5 text-slate-950" />
              <span>CLAIM DAY {dayToClaimToday} REWARD NOW!</span>
            </button>
          ) : (
            <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs text-purple-200 font-semibold">
              <Clock className="w-4 h-4 text-amber-300 animate-spin" />
              <span>
                Next Reward In:{' '}
                <strong className="text-amber-300 font-mono text-sm ml-1">
                  {String(timeRemaining.hours).padStart(2, '0')}h:{' '}
                  {String(timeRemaining.minutes).padStart(2, '0')}m:{' '}
                  {String(timeRemaining.seconds).padStart(2, '0')}s
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
