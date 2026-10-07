import React, { useState } from 'react';
import { Question, PlayerProfile, TopicId } from '../types/game';
import { isAnswerCorrect } from '../engine/questionValidator';
import { soundFX } from '../utils/sound';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Coins, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  player: PlayerProfile;
  isOpen: boolean;
  onSuccess: (earnedXp: number, earnedMoney: number, topic: TopicId) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  player,
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen) return null;

  // Calculate XP reduction based on hints used
  let effectiveXp = question.xpReward;
  if (hintLevel === 1) effectiveXp = Math.round(question.xpReward * 0.8);
  else if (hintLevel === 2) effectiveXp = Math.round(question.xpReward * 0.5);
  else if (hintLevel >= 3) effectiveXp = Math.round(question.xpReward * 0.15); // solved with full solution

  let effectiveMoney = question.moneyReward;
  if (hintLevel >= 3) effectiveMoney = Math.round(question.moneyReward * 0.25);

  const handleSubmit = (answerToSubmit?: string) => {
    const finalAnswer = answerToSubmit !== undefined ? answerToSubmit : userAnswer;
    if (!finalAnswer.trim()) return;

    setAttempts((prev) => prev + 1);

    const correct = isAnswerCorrect(
      finalAnswer,
      question.correctAnswer,
      question.acceptableAnswers,
      question.unit
    );

    if (correct) {
      soundFX.playCorrect();
      soundFX.playCoin();
      setStatus('correct');
      setShowExplanation(true);
    } else {
      soundFX.playWrong();
      setStatus('wrong');
    }
  };

  const handleRevealNextHint = () => {
    soundFX.playStep();
    if (hintLevel === 0) setHintLevel(1);
    else if (hintLevel === 1) setHintLevel(2);
    else if (hintLevel === 2) {
      setHintLevel(3);
      setShowExplanation(true);
    }
  };

  const handleFinish = () => {
    onSuccess(effectiveXp, effectiveMoney, question.topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto">
        {/* Header Metadata (Clean text, no pill clutter) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span>{question.contextTitle || 'Chapter 17 Challenge'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">{question.subtopic}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-400">
            <span className="flex items-center gap-1 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{effectiveXp} XP</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <Coins className="w-3.5 h-3.5" />
              <span>+${effectiveMoney}</span>
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed whitespace-pre-line">
            {question.questionText}
          </p>
        </div>

        {/* Interactive Input Form based on Question Type */}
        {status !== 'correct' && (
          <div className="mb-6">
            {/* 1. Multiple Choice, Compare Options, Find Error, True/False */}
            {question.options && question.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {question.options.map((opt, idx) => {
                  const isSelected = userAnswer === opt;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUserAnswer(opt);
                        handleSubmit(opt);
                      }}
                      className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <span className="inline-block w-6 text-slate-500 font-mono">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* 2. Numerical Input */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="flex items-center gap-3"
              >
                <div className="relative flex-1">
                  {question.unit === '$' && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg">
                      $
                    </span>
                  )}
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    placeholder="Enter your exact answer..."
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      if (status === 'wrong') setStatus('idle');
                    }}
                    className={`w-full py-3 bg-slate-950 border rounded-xl text-white font-mono text-lg transition-colors placeholder:text-slate-600 placeholder:text-sm placeholder:font-sans focus:outline-none ${
                      question.unit === '$' ? 'pl-8 pr-4' : 'px-4'
                    } ${
                      status === 'wrong' ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                  {question.unit && question.unit !== '$' && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      {question.unit}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!userAnswer.trim()}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        )}

        {/* NOT QUITE! FEEDBACK BOX */}
        {status === 'wrong' && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl mb-5 text-rose-200">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <h4 className="font-bold text-sm tracking-wide uppercase text-rose-300">
                Not Quite!
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mb-3">
              Review your calculation and try again, or consult a structured hint below.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserAnswer('');
                  setStatus('idle');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/50 rounded-lg text-rose-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              {hintLevel < 3 && (
                <button
                  type="button"
                  onClick={handleRevealNextHint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>
                    {hintLevel === 0 && 'Unlock Hint 1 (-20% XP)'}
                    {hintLevel === 1 && 'Unlock Hint 2 (-50% XP)'}
                    {hintLevel === 2 && 'Reveal Full Solution'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* SUCCESS CELEBRATION BOX */}
        {status === 'correct' && (
          <div className="p-5 bg-emerald-950/40 border border-emerald-700/60 rounded-2xl mb-5 text-emerald-200">
            <div className="flex items-center gap-2.5 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-base text-emerald-300">
                  EXCELLENT CALCULATION!
                </h4>
                <p className="text-xs text-emerald-400">
                  Correct Answer: {String(question.correctAnswer)} {question.unit || ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-emerald-900/60">
              <span>Earned: +{effectiveXp} XP</span>
              <span>·</span>
              <span>Virtual Cash: +${effectiveMoney}</span>
              {player.currentStreak > 0 && (
                <>
                  <span>·</span>
                  <span className="text-amber-400">Streak: {player.currentStreak + 1} 🔥</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* HINT 1 CONTAINER */}
        {hintLevel >= 1 && (
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl mb-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Hint 1: Conceptual Strategy</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{question.hint1}</p>
          </div>
        )}

        {/* HINT 2 CONTAINER */}
        {hintLevel >= 2 && (
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl mb-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Hint 2: First Calculation Step</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{question.hint2}</p>
          </div>
        )}

        {/* STEP-BY-STEP FULL SOLUTION */}
        {showExplanation && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl mb-5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-200 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Step-by-Step Worked Solution</span>
            </div>
            <ol className="space-y-1.5 text-xs sm:text-sm text-slate-300 list-decimal list-inside mb-3">
              {question.solutionSteps.map((step, sIdx) => (
                <li key={sIdx} className="leading-relaxed font-mono text-slate-300">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-xs text-slate-400 border-t border-slate-800 pt-2 leading-relaxed">
              {question.fullExplanation}
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2">
          {status !== 'correct' && hintLevel === 0 && (
            <button
              type="button"
              onClick={handleRevealNextHint}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need a Hint?</span>
            </button>
          )}

          {status !== 'correct' && hintLevel > 0 && hintLevel < 3 && (
            <button
              type="button"
              onClick={handleRevealNextHint}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need More Help?</span>
            </button>
          )}

          <div className="ml-auto">
            {status === 'correct' ? (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Continue Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : hintLevel >= 3 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close & Review Board
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
