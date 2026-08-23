import React from 'react';
import { Candy, BlockerType } from '../types';
import { Sparkles, Zap, Flame, ShieldAlert } from 'lucide-react';

interface CandyTileProps {
  candy: Candy | null;
  blocker: BlockerType;
  isSelected?: boolean;
  isHint?: boolean;
  cellBaseBg?: string;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const CandyTile: React.FC<CandyTileProps> = ({
  candy,
  blocker,
  isSelected,
  isHint,
  cellBaseBg,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      onClick={onClick}
      draggable={!!candy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        relative w-full h-full aspect-square rounded-xl flex items-center justify-center select-none cursor-pointer
        transition-all duration-200 transform hover:scale-105 active:scale-95
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-20 shadow-lg' : ''}
        ${isHint ? 'animate-bounce ring-2 ring-pink-400 z-10' : ''}
        ${blocker === 'jelly-1' ? 'bg-pink-500/20 border border-pink-400/40 backdrop-blur-xs' : cellBaseBg || 'bg-slate-800/40'}
        ${blocker === 'ice-1' ? 'border-2 border-cyan-300/80 bg-cyan-400/20 shadow-inner' : ''}
        ${blocker === 'chocolate' ? 'bg-amber-950 border-2 border-amber-800 rounded-lg shadow-md' : ''}
      `}
    >
      {/* Jelly visual layer */}
      {blocker === 'jelly-1' && (
        <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-pink-400/30 to-purple-500/30 border border-pink-300/50 pointer-events-none animate-pulse" />
      )}

      {/* Ice visual layer */}
      {blocker === 'ice-1' && (
        <div className="absolute inset-0 rounded-xl bg-cyan-200/40 backdrop-blur-[1px] border border-cyan-100 flex items-center justify-center pointer-events-none z-10">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-cyan-100 to-transparent" />
        </div>
      )}

      {/* Chocolate blocker */}
      {blocker === 'chocolate' && (
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-900 to-amber-950 flex items-center justify-center border-2 border-amber-800 shadow-inner">
          <ShieldAlert className="w-6 h-6 text-amber-600/80" />
        </div>
      )}

      {/* Candy rendering */}
      {candy && blocker !== 'chocolate' && (
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          {candy.isIngredient ? (
            <IngredientVisual type={candy.ingredientType || 'cherry'} />
          ) : candy.type === 'color-bomb' ? (
            <ColorBombVisual />
          ) : (
            <StandardCandyVisual color={candy.color} type={candy.type} />
          )}
        </div>
      )}
    </div>
  );
};

const StandardCandyVisual: React.FC<{ color: string; type: Candy['type'] }> = ({ color, type }) => {
  const colorGradients: Record<string, string> = {
    red: 'from-red-400 via-rose-500 to-red-700 shadow-red-500/50',
    orange: 'from-amber-300 via-orange-500 to-amber-700 shadow-orange-500/50',
    yellow: 'from-yellow-200 via-amber-400 to-yellow-600 shadow-yellow-400/50',
    green: 'from-emerald-300 via-green-500 to-emerald-800 shadow-green-500/50',
    blue: 'from-sky-300 via-blue-500 to-indigo-700 shadow-blue-500/50',
    purple: 'from-fuchsia-400 via-purple-600 to-indigo-900 shadow-purple-500/50',
  };

  const gradient = colorGradients[color] || colorGradients.red;

  return (
    <div
      className={`
        relative w-full h-full rounded-full bg-gradient-to-br ${gradient}
        shadow-md flex items-center justify-center overflow-hidden
        transition-all duration-300 transform hover:rotate-6
      `}
    >
      {/* Top Gloss Shine */}
      <div className="absolute top-1 left-2 w-1/2 h-1/3 rounded-full bg-white/40 blur-[0.5px] transform -rotate-12 pointer-events-none" />
      <div className="absolute bottom-1 right-2 w-1/4 h-1/4 rounded-full bg-white/20 blur-[0.5px] pointer-events-none" />

      {/* Striped Candy Overlays */}
      {type === 'striped-h' && (
        <div className="absolute inset-0 flex flex-col justify-evenly items-center pointer-events-none">
          <div className="w-full h-1 bg-white/90 shadow-sm shadow-white animate-pulse" />
          <div className="w-full h-1.5 bg-white/90 shadow-sm shadow-white animate-pulse" />
          <div className="w-full h-1 bg-white/90 shadow-sm shadow-white animate-pulse" />
        </div>
      )}

      {type === 'striped-v' && (
        <div className="absolute inset-0 flex row justify-evenly items-center pointer-events-none">
          <div className="h-full w-1 bg-white/90 shadow-sm shadow-white animate-pulse" />
          <div className="h-full w-1.5 bg-white/90 shadow-sm shadow-white animate-pulse" />
          <div className="h-full w-1 bg-white/90 shadow-sm shadow-white animate-pulse" />
        </div>
      )}

      {/* Wrapped Candy Overlay */}
      {type === 'wrapped' && (
        <div className="absolute inset-0 border-2 border-white/80 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-[0.5px]">
          <Flame className="w-5 h-5 text-yellow-200 animate-pulse drop-shadow" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rotate-45 rounded-xs" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rotate-45 rounded-xs" />
        </div>
      )}
    </div>
  );
};

const ColorBombVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-purple-800 via-pink-600 to-amber-400 p-0.5 shadow-lg shadow-pink-500/50 animate-pulse flex items-center justify-center">
      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/40 via-purple-500/20 to-transparent animate-spin" />
        <Sparkles className="w-6 h-6 text-yellow-300 animate-spin z-10 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
        {/* Colorful sprinkles */}
        <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm" />
        <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-sm" />
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
        <div className="absolute bottom-2 left-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-sm" />
      </div>
    </div>
  );
};

const IngredientVisual: React.FC<{ type: 'cherry' | 'hazelnut' }> = ({ type }) => {
  if (type === 'cherry') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-900 border border-red-300 shadow-md shadow-red-900/60 flex items-center justify-center">
          <div className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-white/50 blur-[0.5px]" />
          <Zap className="w-3.5 h-3.5 text-amber-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-7 h-7 rounded-lg rotate-45 bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400 shadow-md flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-amber-300/40" />
      </div>
    </div>
  );
};
