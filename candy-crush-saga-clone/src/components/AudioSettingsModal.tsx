import React, { useState } from 'react';
import { Volume2, Volume1, VolumeX, Music, Sliders, X, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [bgmEnabled, setBgmEnabled] = useState(sound.isBgmEnabled());
  const [soundEnabled, setSoundEnabled] = useState(sound.isSoundEnabled());
  const [bgmVolume, setBgmVolumeState] = useState(Math.round(sound.getBgmVolume() * 100));
  const [sfxVolume, setSfxVolumeState] = useState(Math.round(sound.getSfxVolume() * 100));

  if (!isOpen) return null;

  const handleToggleBgm = () => {
    const newState = sound.toggleBgm();
    setBgmEnabled(newState);
  };

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      sound.playPop();
    }
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBgmVolumeState(val);
    sound.setBgmVolume(val / 100);
    if (val > 0 && !bgmEnabled) {
      sound.setBgmEnabled(true);
      setBgmEnabled(true);
    }
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSfxVolumeState(val);
    sound.setSfxVolume(val / 100);
    if (val > 0 && !soundEnabled) {
      sound.setSoundEnabled(true);
      setSoundEnabled(true);
    }
  };

  const handleTestSfx = () => {
    sound.playMatch(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#2D1B4D] via-[#23152d] to-[#1a1033] border-2 border-amber-400/50 p-6 shadow-2xl text-white flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-200 tracking-wide">Audio Settings</h2>
              <p className="text-[11px] text-purple-200/70 font-medium">Customize music & sound effects</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BGM Music Section */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border transition ${bgmEnabled ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <Music className={`w-4 h-4 ${bgmEnabled ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-black text-amber-100">Background Music</div>
                <div className="text-[10px] text-purple-200/70">{bgmEnabled ? 'Melodic saga loop active' : 'Music muted'}</div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleBgm}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                bgmEnabled ? 'bg-pink-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  bgmEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-purple-200/80 flex items-center gap-1">
                {bgmVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : bgmVolume < 50 ? <Volume1 className="w-3.5 h-3.5 text-pink-300" /> : <Volume2 className="w-3.5 h-3.5 text-pink-300" />}
                Music Volume
              </span>
              <span className="text-pink-300 font-mono font-extrabold">{bgmEnabled ? `${bgmVolume}%` : 'Muted'}</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={bgmVolume}
              onChange={handleBgmVolumeChange}
              disabled={!bgmEnabled}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400 disabled:opacity-40"
            />
          </div>
        </div>

        {/* Sound Effects Section */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border transition ${soundEnabled ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-black text-amber-100">Sound Effects (SFX)</div>
                <div className="text-[10px] text-purple-200/70">{soundEnabled ? 'Tile swaps & chimes enabled' : 'SFX muted'}</div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-purple-200/80 flex items-center gap-1">
                {sfxVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : sfxVolume < 50 ? <Volume1 className="w-3.5 h-3.5 text-emerald-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
                SFX Volume
              </span>
              <span className="text-emerald-300 font-mono font-extrabold">{soundEnabled ? `${sfxVolume}%` : 'Muted'}</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={handleSfxVolumeChange}
              disabled={!soundEnabled}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-40"
            />
          </div>

          {/* Test SFX Button */}
          {soundEnabled && (
            <button
              onClick={handleTestSfx}
              className="mt-1 self-end text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-300" />
              Test SFX Chime
            </button>
          )}
        </div>

        {/* Done Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          Save & Close
        </button>
      </div>
    </div>
  );
};
