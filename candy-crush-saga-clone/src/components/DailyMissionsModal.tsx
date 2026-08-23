import React, { useEffect, useState } from 'react';
import { DailyMission, DailyMissionsData } from '../types';
import { getTimeUntilReset } from '../utils/dailyMissions';
import { sound } from '../utils/sound';
import { X, Calendar, CheckCircle2, Gift, Sparkles, Clock, Coins, Flame } from 'lucide-react';

interface DailyMissionsModalProps {
  missionsData: DailyMissionsData;
  onClaimReward: (missionId: string, rewardCoins: number) => void;
  onClose: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  missionsData,
  onClaimReward,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allClaimed = missionsData.missions.every((m) => m.isClaimed);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#27153E] border-2 border-amber-400/50 rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide flex items-center gap-1.5">
                DAILY MISSIONS
              </h2>
              <p className="text-xs text-purple-200/80 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Resets in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
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

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-3 pr-0.5">
          {missionsData.missions.map((mission) => {
            const pct = Math.min(100, Math.floor((mission.current / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className={`relative rounded-2xl p-3.5 sm:p-4 border transition-all flex flex-col gap-2.5 ${
                  mission.isClaimed
                    ? 'bg-slate-900/40 border-white/5 opacity-70'
                    : mission.isCompleted
                    ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-purple-900/40 border-amber-300/80 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30'
                    : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Row: Icon, Title, Reward */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-3xl p-1 bg-white/5 rounded-2xl flex-shrink-0">
                      {mission.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm sm:text-base text-amber-100 truncate">
                        {mission.title}
                      </h3>
                      <p className="text-xs text-purple-200/80 line-clamp-2">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-xl flex-shrink-0">
                    <Coins className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-black text-xs text-amber-300">
                      +{mission.rewardCoins}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Progress Bar & Action Button */}
                <div className="flex items-center justify-between gap-3 mt-1">
                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-200/90 mb-1">
                      <span>Progress</span>
                      <span className="font-mono text-amber-300">
                        {mission.current.toLocaleString()} / {mission.target.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          mission.isCompleted
                            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-sm shadow-amber-400'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {mission.isClaimed ? (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      CLAIMED
                    </div>
                  ) : mission.isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playVictory();
                        onClaimReward(mission.id, mission.rewardCoins);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition flex items-center gap-1.5 flex-shrink-0 animate-pulse"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      CLAIM
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

        {/* All Cleared Banner */}
        {allClaimed ? (
          <div className="mt-2 p-3 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-400/50 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs text-emerald-200">
                ALL DAILY MISSIONS COMPLETED!
              </p>
              <p className="text-[11px] text-emerald-300/80">
                You cleared all tasks for today! Fresh missions will arrive in {timeLeft.hours}h {timeLeft.minutes}m.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2 p-2.5 bg-slate-900/60 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-purple-200/80">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Complete daily tasks to build up your coin stash!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
