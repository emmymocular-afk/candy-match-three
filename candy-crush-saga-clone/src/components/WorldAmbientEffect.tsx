import React from 'react';
import { WorldThemeConfig } from '../utils/worldThemes';

interface WorldAmbientEffectProps {
  effectType: WorldThemeConfig['gameAmbientEffect'];
  className?: string;
}

export const WorldAmbientEffect: React.FC<WorldAmbientEffectProps> = ({ effectType, className = '' }) => {
  if (effectType === 'petals') {
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
        <div className="absolute top-10 left-10 text-2xl animate-float-bubble opacity-40">🌸</div>
        <div className="absolute top-1/3 right-12 text-3xl animate-bounce opacity-30">🌿</div>
        <div className="absolute bottom-1/4 left-16 text-xl animate-float-bubble opacity-50">🍃</div>
        <div className="absolute bottom-12 right-20 text-2xl animate-pulse opacity-40">🌺</div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
      </div>
    );
  }

  if (effectType === 'cocoa-dust') {
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
        <div className="absolute top-12 right-10 text-2xl animate-float-bubble opacity-40">🍫</div>
        <div className="absolute top-1/2 left-8 text-3xl animate-pulse opacity-30">🌰</div>
        <div className="absolute bottom-20 right-16 text-xl animate-float-bubble opacity-40">✨</div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-600/15 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-amber-900/20 blur-3xl" />
      </div>
    );
  }

  if (effectType === 'bubbles') {
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
        <div className="absolute bottom-10 left-12 text-2xl animate-bounce opacity-50">🫧</div>
        <div className="absolute top-20 right-16 text-3xl animate-float-bubble opacity-40">🧊</div>
        <div className="absolute top-1/2 left-10 text-xl animate-pulse opacity-40">🌊</div>
        <div className="absolute bottom-1/3 right-12 text-2xl animate-bounce opacity-40">🫧</div>
        <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl" />
      </div>
    );
  }

  if (effectType === 'steam-sparks') {
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
        <div className="absolute top-16 left-12 text-2xl animate-spin opacity-30">⚙️</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-pulse opacity-40">⚡</div>
        <div className="absolute bottom-20 left-16 text-2xl animate-float-bubble opacity-40">🏭</div>
        <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl" />
      </div>
    );
  }

  // royal-stars
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <div className="absolute top-10 right-12 text-3xl animate-float-bubble opacity-50">👑</div>
      <div className="absolute top-1/3 left-10 text-2xl animate-pulse opacity-50">✨</div>
      <div className="absolute bottom-24 right-16 text-2xl animate-bounce opacity-40">🏰</div>
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-rose-600/15 blur-3xl" />
    </div>
  );
};
