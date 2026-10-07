import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { generateDailyChallenge, getTodayDateString } from '../engine/dailyChallenge';
import { QuestionModal } from './QuestionModal';
import { Sparkles, Calendar, CheckCircle2, Flame, ArrowRight, X } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface DailyChallengeModalProps {
  player: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (earnedXp: number, earnedMoney: number) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  player,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inQuiz, setInQuiz] = useState(false);
  const todayStr = getTodayDateString();
  const isAlreadyCompletedToday = player.lastDailyChallengeDate === todayStr;

  if (!isOpen) return null;

  const challengeQuestion = generateDailyChallenge(todayStr);

  const handleStart = () => {
    soundFX.playStep();
    setInQuiz(true);
  };

  const handleQuizSuccess = (xp: number, money: number) => {
    onSuccess(xp, money);
    setInQuiz(false);
    onClose();
  };

  if (inQuiz) {
    return (
      <QuestionModal
        isOpen={true}
        question={challengeQuestion}
        player={player}
        onSuccess={handleQuizSuccess}
        onClose={() => setInQuiz(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayStr}</span>
            </div>
            <h3 className="text-xl font-bold text-white">Daily Money Challenge</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Put your Chapter 17 mastery to the test with today's featured financial problem. Successfully solving it grants massive XP and expands your fortune.
        </p>

        {isAlreadyCompletedToday ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-2xl text-emerald-200 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-sm block">COMPLETED FOR TODAY!</span>
              <span className="text-xs text-slate-300">
                You have already claimed today's bounty. Come back tomorrow for the next challenge!
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-1">XP Reward</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                +{challengeQuestion.xpReward} XP
              </span>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Virtual Bounty</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                +${challengeQuestion.moneyReward}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
          {!isAlreadyCompletedToday && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              <span>ACCEPT CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
