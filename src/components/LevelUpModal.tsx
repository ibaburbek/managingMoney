import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/sound';
import { Sparkles, Trophy, ArrowRight, Coins } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  levelTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  levelTitle,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFX.playLevelUp();
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/30 flex items-center justify-center mb-5 transform rotate-6 hover:rotate-0 transition-transform">
          <Trophy className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
          Promotion Achieved!
        </span>
        <h2 className="text-3xl font-black text-white mb-2">
          LEVEL {newLevel}
        </h2>
        <p className="text-lg font-bold text-amber-300 mb-4">
          {levelTitle}
        </p>

        <p className="text-xs text-slate-300 max-w-xs mx-auto mb-6 leading-relaxed">
          Your financial mathematics acumen has expanded your influence in Money Quest City.
        </p>

        <div className="p-3 bg-slate-950/80 border border-amber-400/30 rounded-xl mb-6 flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <Coins className="w-4 h-4" />
          <span>Bonus Grant: +${newLevel * 100} virtual stipend credited!</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>CONTINUE QUEST</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
