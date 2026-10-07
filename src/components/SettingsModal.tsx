import React, { useState } from 'react';
import { GameDifficulty, PlayerProfile } from '../types/game';
import { soundFX } from '../utils/sound';
import { Settings, Volume2, VolumeX, ShieldAlert, RotateCcw, X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile | null;
  onUpdateDifficulty: (difficulty: GameDifficulty) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdateDifficulty,
  soundMuted,
  onToggleSound,
  onResetProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Game Settings</h3>
            <p className="text-xs text-slate-400">Customize audio & Cambridge curriculum level</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Audio FX Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {soundMuted ? (
                <VolumeX className="w-5 h-5 text-slate-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <span className="text-sm font-semibold text-white block">Synthesized Sound FX</span>
                <span className="text-xs text-slate-400">Dice, chimes, and coin audio</span>
              </div>
            </div>

            <button
              onClick={onToggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                !soundMuted
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {!soundMuted ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Curriculum Level Toggle (Core vs Extended) */}
          {player && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div>
                <span className="text-sm font-semibold text-white block">Cambridge 0580 Syllabus Level</span>
                <span className="text-xs text-slate-400">Controls question complexity and reverse calculations</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onUpdateDifficulty('CORE');
                    soundFX.playStep();
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    player.difficulty === 'CORE'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  CORE (Grades C–G)
                </button>
                <button
                  onClick={() => {
                    onUpdateDifficulty('EXTENDED');
                    soundFX.playStep();
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    player.difficulty === 'EXTENDED'
                      ? 'bg-purple-500 text-white border-purple-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  EXTENDED (Grades A*–E)
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone: Reset Progress */}
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
              Reset Progress
            </span>
            <p className="text-xs text-slate-400 mb-3">
              Erase all local profile data, properties, levels, and achievements.
            </p>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
