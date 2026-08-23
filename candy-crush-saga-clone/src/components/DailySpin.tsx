import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  LUCKY_WHEEL_REWARDS,
  LuckyWheelReward,
  getTimeUntilNextSpin,
  isFreeSpinAvailable,
} from '../utils/luckyWheel';
import { sound } from '../utils/sound';
import {
  Sparkles,
  X,
  Clock,
  Gift,
  Coins,
  Crown,
  Flame,
  Zap,
  RotateCw,
} from 'lucide-react';

interface DailySpinProps {
  lastSpinDate?: string;
  coins?: number;
  onClose: () => void;
  onClaimReward: (rewardType: string, amount: number) => void;
  onSpendCoinsForSpin?: (cost: number) => boolean;
}

export const DailySpin: React.FC<DailySpinProps> = ({
  lastSpinDate,
  coins = 0,
  onClose,
  onClaimReward,
  onSpendCoinsForSpin,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<LuckyWheelReward | null>(null);
  const [timerInfo, setTimerInfo] = useState(getTimeUntilNextSpin(lastSpinDate));

  const extraSpinCost = 100;

  // Countdown timer for 24h reset
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerInfo(getTimeUntilNextSpin(lastSpinDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSpinDate]);

  const numSlices = LUCKY_WHEEL_REWARDS.length;
  const sliceAngle = 360 / numSlices;

  const freeSpinReady = timerInfo.isReady;

  const triggerSpin = (isPaid: boolean) => {
    if (spinning) return;

    if (isPaid) {
      if (onSpendCoinsForSpin) {
        const success = onSpendCoinsForSpin(extraSpinCost);
        if (!success) return;
      }
    }

    setSpinning(true);
    setWonReward(null);

    sound.playWheelSpin();

    // Select random reward with index
    const selectedIdx = Math.floor(Math.random() * numSlices);
    const prize = LUCKY_WHEEL_REWARDS[selectedIdx];

    // Calculate rotation angle to align chosen slice under top pointer (0 deg = top)
    // Slice i starts at angle i * sliceAngle.
    // To position center of slice i at the top (0 deg):
    // sliceCenter = (i * sliceAngle) + (sliceAngle / 2)
    // Wheel rotates clockwise by R degrees: targetAngle = 360 * 6 + (360 - sliceCenter)
    const sliceCenter = selectedIdx * sliceAngle + sliceAngle / 2;
    const targetAngle = rotation + 360 * 6 + ((360 - (sliceCenter % 360)) % 360) - (rotation % 360);

    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setWonReward(prize);

      if (prize.rarity === 'Legendary' || prize.rarity === 'Rare') {
        sound.playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        sound.playCoin();
      }

      onClaimReward(prize.type, prize.amount);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#221038] border-2 border-amber-400/50 rounded-[32px] p-5 sm:p-6 shadow-2xl text-center flex flex-col items-center gap-3 text-white overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

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

        {/* Title & Banner */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-300 animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide uppercase">
              LUCKY WHEEL
            </h2>
          </div>
          <p className="text-xs text-purple-200/80 font-medium">
            Spin once every 24 hours for rare boosters & coins!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 my-1 flex items-center justify-center select-none">
          
          {/* Top Pointer Needle */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-x-[12px] border-x-transparent border-t-[22px] border-t-amber-300 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-200 shadow-md -mt-2" />
          </div>

          {/* Outer Ring with Bulb Dots */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.3)] z-10 pointer-events-none flex items-center justify-center">
            {Array.from({ length: 12 }).map((_, idx) => {
              const bulbAngle = (360 / 12) * idx;
              const rad = (bulbAngle * Math.PI) / 180;
              const r = 122; // radius
              const x = Math.sin(rad) * r;
              const y = -Math.cos(rad) * r;

              return (
                <div
                  key={idx}
                  className={`absolute w-2.5 h-2.5 rounded-full border border-amber-200 shadow-sm ${
                    spinning
                      ? idx % 2 === 0
                        ? 'bg-yellow-300 animate-ping'
                        : 'bg-amber-400'
                      : 'bg-yellow-300'
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                />
              );
            })}
          </div>

          {/* SVG Rotatable Wheel */}
          <div
            className="w-full h-full rounded-full relative shadow-2xl overflow-hidden border-2 border-amber-300/40"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4500ms cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {LUCKY_WHEEL_REWARDS.map((reward, i) => {
                const startAngle = i * sliceAngle - 90; // offset so 0 index starts at top
                const endAngle = (i + 1) * sliceAngle - 90;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + sliceAngle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 32 * Math.cos(midRad);
                const textY = 50 + 32 * Math.sin(midRad);

                return (
                  <g key={reward.id}>
                    <path
                      d={pathData}
                      fill={reward.bgHex}
                      stroke="#221038"
                      strokeWidth="1.2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="5"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {reward.icon} {reward.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Wheel Center Hub */}
          <div className="absolute w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-300 z-20 flex flex-col items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="text-[9px] font-black text-amber-200 tracking-tighter">SPIN</span>
          </div>
        </div>

        {/* Won Reward Banner OR Timer Status */}
        {wonReward ? (
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-300/60 rounded-2xl p-3 w-full animate-in zoom-in-90 duration-200 text-center">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest block">
              🎉 CONGRATULATIONS!
            </span>
            <div className="text-base font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-xl">{wonReward.icon}</span>
              <span>You won {wonReward.name}!</span>
            </div>
            {wonReward.rarity === 'Legendary' && (
              <p className="text-[10px] text-amber-200 font-bold mt-1">
                🌟 LEGENDARY JACKPOT REWARD CLAIMED!
              </p>
            )}
          </div>
        ) : !freeSpinReady ? (
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-2.5 w-full flex items-center justify-center gap-2 text-xs text-purple-200/90 font-semibold">
            <Clock className="w-4 h-4 text-amber-300 animate-spin" />
            <span>
              Next Free Spin: <strong className="text-amber-300 font-mono">{timerInfo.hours}h {timerInfo.minutes}m {timerInfo.seconds}s</strong>
            </span>
          </div>
        ) : (
          <p className="text-xs text-amber-200/90 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Your Daily Free Spin is Ready!
          </p>
        )}

        {/* Spin Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {freeSpinReady ? (
            <button
              onClick={() => triggerSpin(false)}
              disabled={spinning}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
              {spinning ? 'SPINNING WHEEL...' : 'SPIN FREE NOW!'}
            </button>
          ) : (
            <button
              onClick={() => triggerSpin(true)}
              disabled={spinning || coins < extraSpinCost}
              className={`w-full py-3 rounded-2xl font-black text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                coins >= extraSpinCost
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-pink-900/50 hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-300" />
              {spinning ? 'SPINNING...' : `SPIN AGAIN (${extraSpinCost} COINS)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
