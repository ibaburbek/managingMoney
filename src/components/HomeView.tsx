import React from 'react';
import { Play, BookOpen, Target, Settings, Sparkles, Coins, TrendingUp, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { HEROES } from '../data/heroes';

interface HomeViewProps {
  player: PlayerProfile | null;
  onPlay: () => void;
  onNewGame: () => void;
  onLearn: () => void;
  onPractice: () => void;
  onSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  player,
  onPlay,
  onNewGame,
  onLearn,
  onPractice,
  onSettings,
}) => {
  const heroData = player ? HEROES[player.heroId] : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center text-center">
        {/* Editorial Subtitle Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400/90">
          <span>Cambridge IGCSE 0580</span>
          <span aria-hidden="true">·</span>
          <span>Core & Extended</span>
          <span aria-hidden="true">·</span>
          <span>Chapter 17: Managing Money</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">
          MONEY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">QUEST</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-medium text-slate-300 max-w-2xl mx-auto mb-10 text-balance">
          Master Money. Build Your Future.
        </p>

        {/* Action Button Suite */}
        <div className="w-full max-w-md space-y-3.5 mb-12">
          {player ? (
            <div className="space-y-3">
              <button
                onClick={onPlay}
                className="w-full flex items-center justify-center gap-3 py-4 px-8 text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>CONTINUE QUEST ({player.name})</span>
              </button>

              <button
                onClick={onNewGame}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
                <span>Create New Character</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onPlay}
              className="w-full flex items-center justify-center gap-3 py-4 px-8 text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>PLAY MONEY QUEST</span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={onLearn}
              className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>LEARN</span>
            </button>

            <button
              onClick={onPractice}
              className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>PRACTICE</span>
            </button>

            <button
              onClick={onSettings}
              className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full text-left">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">17.1 Earning Money</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculate hourly wages, overtime multipliers (1.5×, 2×), gross salaries, pension deductions, and net take-home pay.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">17.2 Borrowing & Investing</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Master Simple Interest formula (PRT/100) and Compound Interest acceleration. Compare bank returns and loan plans.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">17.3 Buying & Selling</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Solve real-life cost prices, selling prices, percentage profit and loss on cost, retail discounts, and reverse percentages.
            </p>
          </div>
        </div>
      </div>

      {/* Footer info banner */}
      <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        Money Quest · IGCSE 0580 Mathematical RPG Simulator · Single-Player Edition
      </footer>
    </div>
  );
};
