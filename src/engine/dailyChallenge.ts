import { Question } from '../types/game';
import { generateQuestion } from './questionGenerator';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateDailyChallenge(dateString: string): Question {
  // Generate an Extended level multi-step or high difficulty question for the daily challenge
  const q = generateQuestion({
    difficulty: 'EXTENDED',
  });

  return {
    ...q,
    contextTitle: `Daily Money Challenge [${dateString}]`,
    xpReward: Math.round(q.xpReward * 1.5) + 50,
    moneyReward: Math.round(q.moneyReward * 1.5) + 150,
  };
}
