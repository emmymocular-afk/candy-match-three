import React from 'react';
import { ActiveBooster } from '../types';
import { Hammer, ArrowLeftRight, Sparkles, RefreshCw, PlusCircle } from 'lucide-react';

interface BoostersPanelProps {
  boosters: {
    hammer: number;
    freeSwap: number;
    colorBombStart: number;
    stripedStart: number;
    extraMoves: number;
  };
  activeBooster: ActiveBooster;
  onSelectBooster: (booster: ActiveBooster) => void;
  onUseExtraMoves: () => void;
  onUseShuffle: () => void;
  onBuyBooster: (type: string) => void;
}

export const BoostersPanel: React.FC<BoostersPanelProps> = ({
  boosters,
  activeBooster,
  onSelectBooster,
  onUseExtraMoves,
  onUseShuffle,
  onBuyBooster,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 flex items-center justify-around bg-slate-900/90 border-t border-slate-800 rounded-t-2xl shadow-xl">
      {/* Lollipop Hammer */}
      <BoosterButton
        icon={<Hammer className="w-5 h-5 text-pink-400" />}
        name="Hammer"
        count={boosters.hammer}
        isActive={activeBooster === 'hammer'}
        onClick={() => {
          if (boosters.hammer > 0) {
            onSelectBooster(activeBooster === 'hammer' ? 'none' : 'hammer');
          } else {
            onBuyBooster('hammer');
          }
        }}
      />

      {/* Free Swap */}
      <BoosterButton
        icon={<ArrowLeftRight className="w-5 h-5 text-cyan-400" />}
        name="Free Swap"
        count={boosters.freeSwap}
        isActive={activeBooster === 'freeSwap'}
        onClick={() => {
          if (boosters.freeSwap > 0) {
            onSelectBooster(activeBooster === 'freeSwap' ? 'none' : 'freeSwap');
          } else {
            onBuyBooster('freeSwap');
          }
        }}
      />

      {/* Shuffle Board */}
      <BoosterButton
        icon={<RefreshCw className="w-5 h-5 text-amber-400" />}
        name="Shuffle"
        count={3} // free tactical tool
        isActive={false}
        onClick={onUseShuffle}
      />

      {/* Extra Moves */}
      <BoosterButton
        icon={<PlusCircle className="w-5 h-5 text-emerald-400" />}
        name="+5 Moves"
        count={boosters.extraMoves}
        isActive={false}
        onClick={() => {
          if (boosters.extraMoves > 0) {
            onUseExtraMoves();
          } else {
            onBuyBooster('extraMoves');
          }
        }}
      />
    </div>
  );
};

const BoosterButton: React.FC<{
  icon: React.ReactNode;
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, name, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
        ${
          isActive
            ? 'bg-pink-600/90 text-white ring-2 ring-pink-300 scale-110 shadow-lg shadow-pink-500/50'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60'
        }
      `}
    >
      <div className="relative">
        {icon}
        {count > 0 ? (
          <span className="absolute -top-2 -right-3 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950 border border-slate-900 shadow">
            {count}
          </span>
        ) : (
          <span className="absolute -top-2 -right-3 px-1 py-0.5 text-[9px] font-bold rounded-full bg-pink-500 text-white shadow">
            +
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold mt-1 tracking-tight text-slate-300">{name}</span>
    </button>
  );
};
