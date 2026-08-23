import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, Play, MapPin, Sparkles, AlertCircle, Trophy, BarChart2, Calendar, Gift, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface GameOverModalProps {
  isWin: boolean;
  score: number;
  stars: number;
  levelId: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onOpenMap: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAnalytics?: () => void;
  onOpenMissions?: () => void;
  onOpenDailySpin?: () => void;
  onOpenDailyStreak?: () => void;
  onOpenWeeklyChallenges?: () => void;
  onBuyExtraMovesOffer?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWin,
  score,
  stars,
  levelId,
  coinsEarned,
  onNextLevel,
  onRetry,
  onOpenMap,
  onOpenLeaderboard,
  onOpenAnalytics,
  onOpenMissions,
  onOpenDailySpin,
  onOpenDailyStreak,
  onOpenWeeklyChallenges,
  onBuyExtraMovesOffer,
}) => {
  useEffect(() => {
    if (isWin) {
      sound.playVictory();
      // Launch celebratory confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playInvalid();
    }
  }, [isWin]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-purple-950 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Title */}
        {isWin ? (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-extrabold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Sugar Rush Completed!
            </div>
            <h2 className="text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 drop-shadow">
              LEVEL {levelId} PASSED!
            </h2>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-extrabold text-xs uppercase tracking-widest mb-1">
              <AlertCircle className="w-3.5 h-3.5" /> Out of Moves!
            </div>
            <h2 className="text-2xl font-black text-rose-200">OUT OF MOVES!</h2>
          </div>
        )}

        {/* Stars Animation */}
        {isWin && (
          <div className="flex gap-3 my-1">
            {[1, 2, 3].map((starIdx) => {
              const hasStar = stars >= starIdx;
              return (
                <Star
                  key={starIdx}
                  className={`w-10 h-10 transition-all duration-500 transform ${
                    hasStar
                      ? 'text-yellow-300 fill-yellow-400 scale-125 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] rotate-6'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Stats card */}
        <div className="w-full bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 flex flex-col gap-2 text-xs">
          <div className="flex justify-between font-bold text-slate-300">
            <span>Final Score:</span>
            <span className="text-yellow-300 text-sm font-black">{score.toLocaleString()}</span>
          </div>
          {isWin && (
            <div className="flex justify-between font-bold text-slate-300">
              <span>Sugar Coins Earned:</span>
              <span className="text-amber-300 font-black">🍬 +{coinsEarned} Coins</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {isWin ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              NEXT LEVEL
            </button>
          ) : (
            <>
              {onBuyExtraMovesOffer && (
                <button
                  onClick={onBuyExtraMovesOffer}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-pink-900/40 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
                >
                  ➕ Get +5 Extra Moves (100 Coins)
                </button>
              )}
              <button
                onClick={onRetry}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                RETRY LEVEL
              </button>
            </>
          )}

          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              View Top 5 Leaderboard
            </button>
          )}

          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="w-full py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <BarChart2 className="w-4 h-4 text-purple-300" />
              Player Analytics (D3 Chart)
            </button>
          )}

          {onOpenDailySpin && (
            <button
              onClick={onOpenDailySpin}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Gift className="w-4 h-4 text-pink-300" />
              Lucky Wheel Spin
            </button>
          )}

          {onOpenDailyStreak && (
            <button
              onClick={onOpenDailyStreak}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-orange-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              Daily Login Streak
            </button>
          )}

          {onOpenWeeklyChallenges && (
            <button
              onClick={onOpenWeeklyChallenges}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              Weekly Challenges & Badges
            </button>
          )}

          {onOpenMissions && (
            <button
              onClick={onOpenMissions}
              className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              Daily Missions & Rewards
            </button>
          )}

          <button
            onClick={onOpenMap}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-4 h-4 text-purple-400" />
            Return to Level Map
          </button>
        </div>
      </div>
    </div>
  );
};
