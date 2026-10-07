import React from 'react';
import { PlayerProfile, TopicId } from '../types/game';
import { HEROES } from '../data/heroes';
import { PROPERTIES } from '../data/properties';
import { ACHIEVEMENTS } from '../data/achievements';
import { 
  Trophy, 
  Coins, 
  Sparkles, 
  Flame, 
  Building2, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Percent,
  Landmark,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  player: PlayerProfile;
  onContinueGame: () => void;
  onLearn: () => void;
  onPractice: () => void;
  onDaily: () => void;
}

const TOPIC_LABELS: Record<TopicId, { title: string; icon: React.ReactNode }> = {
  earning: { title: '17.1 Earning Money', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
  interest: { title: '17.2 Simple Interest', icon: <Landmark className="w-4 h-4 text-indigo-400" /> },
  borrowing: { title: '17.2 Borrowing & Loans', icon: <Coins className="w-4 h-4 text-cyan-400" /> },
  investing: { title: '17.2 Compound Investing', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
  profit_loss: { title: '17.3 Profit & Loss', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
  discount: { title: '17.3 Discounts & Sales', icon: <Percent className="w-4 h-4 text-teal-400" /> },
  financial_reasoning: { title: 'Financial Reasoning', icon: <Target className="w-4 h-4 text-purple-400" /> },
};

function getMasteryTier(pct: number): { label: string; color: string } {
  if (pct >= 81) return { label: 'Mastered', color: 'text-amber-400 bg-amber-400/10' };
  if (pct >= 61) return { label: 'Strong', color: 'text-emerald-400 bg-emerald-400/10' };
  if (pct >= 41) return { label: 'Competent', color: 'text-blue-400 bg-blue-400/10' };
  if (pct >= 21) return { label: 'Developing', color: 'text-purple-400 bg-purple-400/10' };
  return { label: 'Beginner', color: 'text-slate-400 bg-slate-800' };
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  player,
  onContinueGame,
  onLearn,
  onPractice,
  onDaily,
}) => {
  const hero = HEROES[player.heroId];
  const accuracy = player.totalAnswered > 0 
    ? Math.round((player.totalCorrect / player.totalAnswered) * 100) 
    : 0;

  // Calculate total property dividend
  let totalLapDividends = 0;
  player.ownedPropertyIds.forEach((pid) => {
    const prop = PROPERTIES[pid];
    if (prop) {
      const lvl = player.propertyUpgrades[pid] || 0;
      totalLapDividends += lvl > 0 ? prop.upgradeIncome : prop.baseIncome;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full text-slate-100 space-y-8">
      {/* HERO BANNER & PRIMARY STATS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${hero.avatarColor} ring-4 ring-slate-800 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl`}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {hero.title} · Level {player.level}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">{player.difficulty} Mode</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">{player.name}</h1>
              <p className="text-xs text-slate-400 max-w-md mt-1">{hero.bio}</p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onContinueGame}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>BOARD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDaily}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Daily Challenge
            </button>
            <button
              onClick={onPractice}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Practice Drill
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">Virtual Fortune</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
              ${player.money.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">XP Progress</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
              {player.xp} <span className="text-xs text-slate-500 font-normal">/ {player.xpToNextLevel}</span>
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">Math Accuracy</span>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {accuracy}% <span className="text-xs text-slate-500 font-normal">({player.totalCorrect}/{player.totalAnswered})</span>
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">Best Streak</span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono tabular-nums">
              {player.bestStreak} 🔥
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SKILL MASTERY BARS (Section 23) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                IGCSE Chapter 17 Skills
              </span>
              <h2 className="text-xl font-bold text-white">Mathematical Mastery</h2>
            </div>
            <button
              onClick={onLearn}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Study Curriculum →
            </button>
          </div>

          <div className="space-y-4">
            {(Object.keys(TOPIC_LABELS) as TopicId[]).map((topicId) => {
              const meta = TOPIC_LABELS[topicId];
              const stat = player.skillMastery[topicId] || { correct: 0, total: 0, percentage: 0 };
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              const tier = getMasteryTier(pct);

              return (
                <div key={topicId} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      {meta.icon}
                      <span>{meta.title}</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{stat.correct}/{stat.total}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${tier.color}`}>
                        {tier.label} ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REAL ESTATE PORTFOLIO & PASSIVE CASHFLOW */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                Commercial Holdings
              </span>
              <h2 className="text-xl font-bold text-white">Properties Portfolio</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Lap Dividend</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                +${totalLapDividends} / lap
              </span>
            </div>
          </div>

          {player.ownedPropertyIds.length === 0 ? (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                No commercial deeds acquired yet. Travel the city board and solve financial audits to claim properties!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {player.ownedPropertyIds.map((pid) => {
                const prop = PROPERTIES[pid];
                if (!prop) return null;
                const lvl = player.propertyUpgrades[pid] || 0;
                const inc = lvl > 0 ? prop.upgradeIncome : prop.baseIncome;

                return (
                  <div key={pid} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{prop.name}</span>
                      <span className="text-[10px] text-slate-400">Upgrade Level {lvl}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      +${inc}/lap
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ACHIEVEMENTS SHOWCASE (Section 27) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Trophy Hall
            </span>
            <h2 className="text-xl font-bold text-white">
              Achievements ({player.unlockedAchievements.length} / {ACHIEVEMENTS.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = player.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-400/50 shadow-sm'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-800 text-slate-600'
                }`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-1">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {ach.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-amber-400">+{ach.xpReward} XP</span>
                    <span>·</span>
                    <span className="text-emerald-400">+${ach.moneyReward}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
