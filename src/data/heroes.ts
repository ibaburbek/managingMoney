import { HeroId } from '../types/game';

export interface HeroData {
  id: HeroId;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarColor: string;
  accentBg: string;
  borderColor: string;
}

export const HEROES: Record<HeroId, HeroData> = {
  scholar: {
    id: 'scholar',
    name: 'The Scholar',
    title: 'Methodical Analyst',
    tagline: 'Precision in calculation, wisdom in money.',
    bio: 'Dedicated to understanding the foundational principles of finance. Believes that mastering the formulas is the surest route to prosperity.',
    avatarColor: 'from-blue-600 to-indigo-800',
    accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/40',
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'The Entrepreneur',
    title: 'Venture Builder',
    tagline: 'Spot the profit margins, build the empire.',
    bio: 'Thrives on commercial enterprise and high-yield opportunities. Always calculating markups, discounts, and real-world cash flow.',
    avatarColor: 'from-amber-600 to-emerald-700',
    accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    title: 'Market Pathfinder',
    tagline: 'Chart new financial territory without fear.',
    bio: 'Uncovers hidden opportunities in every market square. Specializes in comparing complex options and navigating financial changes.',
    avatarColor: 'from-teal-600 to-cyan-800',
    accentBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    borderColor: 'border-teal-500/40',
  },
  scientist: {
    id: 'scientist',
    name: 'The Scientist',
    title: 'Quantitative Mind',
    tagline: 'Every compound formula tells an exact truth.',
    bio: 'Views interest rates and currency ratios as elegant mathematical laws. Dissects multi-step financial problems with systematic rigor.',
    avatarColor: 'from-purple-600 to-indigo-900',
    accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/40',
  },
  strategist: {
    id: 'strategist',
    name: 'The Strategist',
    title: 'Grand Planner',
    tagline: 'Anticipate deductions, maximize net income.',
    bio: 'Looks three moves ahead on every contract. Excels at balancing gross revenues against taxes and optimizing long-term property investments.',
    avatarColor: 'from-rose-600 to-amber-800',
    accentBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500/40',
  },
};
