import React from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { soundFX } from '../utils/sound';

interface NavbarProps {
  currentView: 'home' | 'board' | 'learn' | 'practice' | 'dashboard';
  onNavigate: (view: 'home' | 'board' | 'learn' | 'practice' | 'dashboard') => void;
  player: PlayerProfile | null;
  onOpenSettings: () => void;
  onOpenDaily: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  player,
  onOpenSettings,
  onOpenDaily,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text wordmark in display font */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            MONEY QUEST
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400">
            IGCSE 0580
          </span>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
          {player && (
            <button
              onClick={() => onNavigate('board')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'board'
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              City Board
            </button>
          )}

          <button
            onClick={() => onNavigate('learn')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'learn'
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Learn
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'practice'
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Practice
          </button>

          {player && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {player && (
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Daily Money Challenge"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden md:inline">Daily Challenge</span>
              <span className="md:hidden">Daily</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
