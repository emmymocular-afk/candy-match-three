import React from 'react';
import { ShoppingBag, X, Hammer, ArrowLeftRight, PlusCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface ShopModalProps {
  coins: number;
  onClose: () => void;
  onBuyBooster: (type: string, cost: number, amount: number) => void;
}

const SHOP_ITEMS = [
  {
    type: 'hammer',
    name: 'Lollipop Hammer',
    desc: 'Smash any candy or blocker',
    amount: 3,
    cost: 150,
    icon: <Hammer className="w-6 h-6 text-pink-400" />,
  },
  {
    type: 'freeSwap',
    name: 'Free Swap Glove',
    desc: 'Swap any two adjacent candies',
    amount: 3,
    cost: 150,
    icon: <ArrowLeftRight className="w-6 h-6 text-cyan-400" />,
  },
  {
    type: 'extraMoves',
    name: '+5 Extra Moves',
    desc: 'Add 5 extra moves to current level',
    amount: 2,
    cost: 100,
    icon: <PlusCircle className="w-6 h-6 text-emerald-400" />,
  },
  {
    type: 'colorBombStart',
    name: 'Color Bomb Booster',
    desc: 'Start level with a Color Bomb',
    amount: 1,
    cost: 200,
    icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({ coins, onClose, onBuyBooster }) => {
  const handlePurchase = (item: typeof SHOP_ITEMS[0]) => {
    if (coins < item.cost) {
      sound.playInvalid();
      return;
    }
    sound.playCoin();
    onBuyBooster(item.type, item.cost, item.amount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-black text-amber-200">SUGAR SWEET SHOP</h2>
        </div>

        <div className="flex justify-between items-center bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
          <span className="text-xs font-bold text-slate-300">Your Sugar Coins:</span>
          <span className="text-sm font-black text-yellow-300">🍬 {coins} Coins</span>
        </div>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                  {item.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-white">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">x{item.amount} Items</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(item)}
                disabled={coins < item.cost}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition disabled:opacity-40"
              >
                🍬 {item.cost}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
