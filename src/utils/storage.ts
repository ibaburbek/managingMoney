import { ACHIEVEMENTS } from '../data/achievements';
import { GameDifficulty, HeroId, PlayerProfile, TopicId } from '../types/game';

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Beginner', minXp: 0, nextXp: 120 },
  { level: 2, title: 'Money Explorer', minXp: 120, nextXp: 280 },
  { level: 3, title: 'Smart Worker', minXp: 280, nextXp: 500 },
  { level: 4, title: 'Trader', minXp: 500, nextXp: 800 },
  { level: 5, title: 'Investor', minXp: 800, nextXp: 1200 },
  { level: 6, title: 'Financial Strategist', minXp: 1200, nextXp: 1750 },
  { level: 7, title: 'Money Master', minXp: 1750, nextXp: 2500 },
  { level: 8, title: 'Grand Economist', minXp: 2500, nextXp: 3500 },
];

export const INITIAL_SKILLS: Record<TopicId, { correct: number; total: number; percentage: number }> = {
  earning: { correct: 0, total: 0, percentage: 0 },
  interest: { correct: 0, total: 0, percentage: 0 },
  borrowing: { correct: 0, total: 0, percentage: 0 },
  investing: { correct: 0, total: 0, percentage: 0 },
  profit_loss: { correct: 0, total: 0, percentage: 0 },
  discount: { correct: 0, total: 0, percentage: 0 },
  financial_reasoning: { correct: 0, total: 0, percentage: 0 },
};

const STORAGE_KEY = 'money_quest_player_profile_v1';

export function calculateLevel(xp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      const current = LEVEL_THRESHOLDS[i];
      return {
        level: current.level,
        title: current.title,
        currentLevelXp: current.minXp,
        nextLevelXp: current.nextXp,
      };
    }
  }
  return {
    level: 1,
    title: 'Beginner',
    currentLevelXp: 0,
    nextLevelXp: 120,
  };
}

export function createNewPlayer(name: string, heroId: HeroId, difficulty: GameDifficulty): PlayerProfile {
  return {
    name,
    heroId,
    difficulty,
    level: 1,
    xp: 0,
    xpToNextLevel: 120,
    money: 1000,
    position: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    ownedPropertyIds: [],
    propertyUpgrades: {},
    skillMastery: { ...INITIAL_SKILLS },
    unlockedAchievements: [],
    questionHistorySignatures: [],
    createdDate: new Date().toISOString(),
  };
}

export function loadPlayerProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerProfile;
    // Ensure all required fields exist
    if (!parsed.name || !parsed.heroId) return null;
    return parsed;
  } catch (err) {
    console.error('Failed to load player profile:', err);
    return null;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save player profile:', err);
  }
}

export function checkNewAchievements(profile: PlayerProfile): { updatedProfile: PlayerProfile; newlyUnlocked: string[] } {
  const currentUnlocked = new Set(profile.unlockedAchievements);
  const newlyUnlocked: string[] = [];
  let xpBonus = 0;
  let moneyBonus = 0;

  for (const ach of ACHIEVEMENTS) {
    if (!currentUnlocked.has(ach.id)) {
      if (ach.requirement(profile)) {
        currentUnlocked.add(ach.id);
        newlyUnlocked.push(ach.id);
        xpBonus += ach.xpReward;
        moneyBonus += ach.moneyReward;
      }
    }
  }

  if (newlyUnlocked.length === 0) {
    return { updatedProfile: profile, newlyUnlocked: [] };
  }

  const updatedProfile: PlayerProfile = {
    ...profile,
    unlockedAchievements: Array.from(currentUnlocked),
    xp: profile.xp + xpBonus,
    money: profile.money + moneyBonus,
  };

  savePlayerProfile(updatedProfile);
  return { updatedProfile, newlyUnlocked };
}
