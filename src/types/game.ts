export type HeroId = 'scholar' | 'entrepreneur' | 'explorer' | 'scientist' | 'strategist';

export type GameDifficulty = 'CORE' | 'EXTENDED';

export type TopicId = 
  | 'earning'
  | 'interest'
  | 'borrowing'
  | 'investing'
  | 'profit_loss'
  | 'discount'
  | 'financial_reasoning';

export type QuestionType = 
  | 'numerical'
  | 'multiple_choice'
  | 'true_false'
  | 'multi_step'
  | 'compare_options'
  | 'find_error';

export interface Question {
  id: string;
  signature: string; // for anti-duplicate tracking
  topic: TopicId;
  subtopic: string;
  difficulty: 1 | 2 | 3 | 4; // 1: Easy, 2: Medium, 3: Hard, 4: Challenge
  mode: GameDifficulty;
  questionType: QuestionType;
  questionText: string;
  contextTitle?: string;
  contextDetail?: string;
  parameters: Record<string, any>;
  options?: string[]; // for multiple choice
  correctAnswer: string | number;
  acceptableAnswers?: (string | number)[];
  unit?: string; // e.g. "$", "%", "hours", "years"
  hint1: string; // Conceptual hint
  hint2: string; // First calculation step
  solutionSteps: string[];
  fullExplanation: string;
  xpReward: number;
  moneyReward: number;
  errorLocation?: string; // For find_error questions
}

export interface PlayerProfile {
  name: string;
  heroId: HeroId;
  difficulty: GameDifficulty;
  level: number;
  xp: number;
  xpToNextLevel: number;
  money: number;
  position: number; // 0 to 27
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  lastDailyChallengeDate?: string;
  ownedPropertyIds: string[];
  propertyUpgrades: Record<string, number>; // propertyId -> upgrade level (0, 1, 2)
  skillMastery: Record<TopicId, { correct: number; total: number; percentage: number }>;
  unlockedAchievements: string[];
  questionHistorySignatures: string[];
  createdDate: string;
}

export interface Tile {
  id: number;
  name: string;
  category: 'start' | 'job' | 'bank' | 'shop' | 'property' | 'advisor' | 'challenge' | 'event' | 'tax';
  description: string;
  topic?: TopicId;
  propertyId?: string;
  iconName: string;
  color: string;
}

export interface PropertyData {
  id: string;
  name: string;
  tileId: number;
  basePrice: number;
  baseIncome: number;
  upgradeCost: number;
  upgradeIncome: number;
  description: string;
  topic: TopicId;
  icon: string;
  imageTheme: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'gameplay' | 'math' | 'wealth' | 'mastery';
  xpReward: number;
  moneyReward: number;
  requirement: (profile: PlayerProfile) => boolean;
}

export interface LessonContent {
  id: string;
  chapterNumber: string;
  title: string;
  subtopics: {
    id: string;
    title: string;
    concept: string;
    explanation: string;
    formula?: string;
    workedExample: {
      question: string;
      steps: string[];
      answer: string;
    };
    interactiveSimulatorType?: 'wages' | 'interest' | 'discount' | 'profit';
    commonMistake: string;
    quickCheck: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  }[];
}
