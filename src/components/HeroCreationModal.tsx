import React, { useState } from 'react';
import { GameDifficulty, HeroId } from '../types/game';
import { HEROES, HeroData } from '../data/heroes';
import { BookOpen, Briefcase, Compass, Atom, Compass as StrategyIcon, Check, ArrowRight, X } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface HeroCreationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (name: string, heroId: HeroId, difficulty: GameDifficulty) => void;
}

const HERO_ICONS: Record<HeroId, React.ReactNode> = {
  scholar: <BookOpen className="w-8 h-8" />,
  entrepreneur: <Briefcase className="w-8 h-8" />,
  explorer: <Compass className="w-8 h-8" />,
  scientist: <Atom className="w-8 h-8" />,
  strategist: <StrategyIcon className="w-8 h-8" />,
};

export const HeroCreationModal: React.FC<HeroCreationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [selectedHero, setSelectedHero] = useState<HeroId>('scholar');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('CORE');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your player name.');
      return;
    }
    setErrorMsg('');
    soundFX.playStep();
    setStep(2);
  };

  const handleNextStep2 = () => {
    soundFX.playStep();
    setStep(3);
  };

  const handleFinish = () => {
    soundFX.playPurchase();
    onComplete(name.trim(), selectedHero, selectedDifficulty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
            01. Name
          </span>
          <span className="text-slate-600">/</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-amber-400' : 'text-slate-500'}`}>
            02. Hero
          </span>
          <span className="text-slate-600">/</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? 'text-amber-400' : 'text-slate-500'}`}>
            03. Syllabus Level
          </span>
        </div>

        {/* STEP 1: PLAYER NAME */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Money Quest</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter the moniker by which you shall be known in Money Quest City.
            </p>

            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Player Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Alex Trader, MathHero, Kiran..."
                  maxLength={20}
                  autoFocus
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-lg transition-colors"
                />
                {errorMsg && (
                  <p className="mt-2 text-xs font-medium text-rose-400">{errorMsg}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Choose Hero</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: CHOOSE HERO */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">Choose Your Hero</h2>
              <span className="text-xs text-slate-400">Purely cosmetic · Zero math advantage</span>
            </div>
            <p className="text-slate-400 text-sm mb-5">
              Select the persona to represent you on the board.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
              {(Object.values(HEROES) as HeroData[]).map((hero) => {
                const isSelected = selectedHero === hero.id;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => {
                      setSelectedHero(hero.id);
                      soundFX.playStep();
                    }}
                    className={`relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hero.avatarColor} flex items-center justify-center text-white mb-3 shadow-inner`}>
                        {HERO_ICONS[hero.id]}
                      </div>
                      <h3 className="font-bold text-white text-base leading-tight mb-0.5">{hero.name}</h3>
                      <p className="text-xs font-medium text-amber-400/90 mb-2">{hero.title}</p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{hero.bio}</p>
                    </div>

                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Select Level</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LEVEL SELECTION (CORE / EXTENDED) */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose Your Level</h2>
            <p className="text-slate-400 text-sm mb-6">
              Align with your Cambridge IGCSE 0580 curriculum targets. You can switch this anytime in Settings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* CORE OPTION */}
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty('CORE');
                  soundFX.playStep();
                }}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedDifficulty === 'CORE'
                    ? 'bg-blue-950/40 border-blue-400 ring-2 ring-blue-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-blue-400">CORE</span>
                  {selectedDifficulty === 'CORE' && <Check className="w-5 h-5 text-blue-400" />}
                </div>
                <p className="text-sm font-medium text-slate-200 mb-2">Grades C through G</p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Standard hourly wages and basic overtime</li>
                  <li>Simple interest (PRT/100) and 1–2 year compound</li>
                  <li>Basic profit, loss, and marked discounts</li>
                  <li>Foundational financial decision making</li>
                </ul>
              </button>

              {/* EXTENDED OPTION */}
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty('EXTENDED');
                  soundFX.playStep();
                }}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedDifficulty === 'EXTENDED'
                    ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-purple-400">EXTENDED</span>
                  {selectedDifficulty === 'EXTENDED' && <Check className="w-5 h-5 text-purple-400" />}
                </div>
                <p className="text-sm font-medium text-slate-200 mb-2">Grades A* through E</p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Multi-step overtime and bonus packages</li>
                  <li>Reverse percentages (Finding original cost price)</li>
                  <li>Multi-year compound interest formula</li>
                  <li>Comparative financial option analysis & error checks</li>
                </ul>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <span>ENTER MONEY QUEST CITY</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
