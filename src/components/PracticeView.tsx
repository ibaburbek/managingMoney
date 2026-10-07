import React, { useState } from 'react';
import { GameDifficulty, Question, QuestionType, TopicId } from '../types/game';
import { generateQuestion } from '../engine/questionGenerator';
import { isAnswerCorrect } from '../engine/questionValidator';
import { soundFX } from '../utils/sound';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  BarChart2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface PracticeViewProps {
  initialTopic?: TopicId;
  defaultDifficulty: GameDifficulty;
  onFinishSession?: (xpEarned: number, correctCount: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialTopic,
  defaultDifficulty,
  onFinishSession,
}) => {
  // Setup configuration state
  const [selectedTopic, setSelectedTopic] = useState<TopicId | 'all'>(initialTopic || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>(defaultDifficulty);
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active session state
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [sessionResults, setSessionResults] = useState<{
    score: number;
    total: number;
    topicStats: Record<string, { correct: number; total: number }>;
  } | null>(null);

  const [currentInput, setCurrentInput] = useState<string>('');
  const [answeredState, setAnsweredState] = useState<'idle' | 'submitted'>('idle');

  const handleStartSession = () => {
    soundFX.playStep();
    const questions: Question[] = [];
    const usedSignatures: string[] = [];

    for (let i = 0; i < questionCount; i++) {
      const q = generateQuestion({
        topic: selectedTopic === 'all' ? undefined : selectedTopic,
        difficulty: selectedDifficulty,
        questionType: selectedType === 'all' ? undefined : selectedType,
        historySignatures: usedSignatures,
      });
      usedSignatures.push(q.signature);
      questions.push(q);
    }

    setSessionQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setCurrentInput('');
    setAnsweredState('idle');
    setSessionResults(null);
    setSessionActive(true);
  };

  const currentQ = sessionQuestions[currentIndex];

  const handleSubmitCurrentAnswer = (answerToSubmit?: string) => {
    const ans = answerToSubmit !== undefined ? answerToSubmit : currentInput;
    if (!ans.trim()) return;

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
    setAnsweredState('submitted');

    const correct = isAnswerCorrect(
      ans,
      currentQ.correctAnswer,
      currentQ.acceptableAnswers,
      currentQ.unit
    );

    if (correct) {
      soundFX.playCorrect();
    } else {
      soundFX.playWrong();
    }
  };

  const handleNextQuestion = () => {
    soundFX.playStep();
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentInput('');
      setAnsweredState('idle');
    } else {
      // Complete Session
      calculateResults();
    }
  };

  const calculateResults = () => {
    let score = 0;
    const topicStats: Record<string, { correct: number; total: number }> = {};

    sessionQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx] || '';
      const correct = isAnswerCorrect(ans, q.correctAnswer, q.acceptableAnswers, q.unit);
      if (correct) score++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0 };
      }
      topicStats[q.topic].total++;
      if (correct) topicStats[q.topic].correct++;
    });

    const results = {
      score,
      total: sessionQuestions.length,
      topicStats,
    };

    setSessionResults(results);
    setSessionActive(false);

    if (onFinishSession) {
      onFinishSession(score * 25, score);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full text-slate-100">
      {/* 1. SETUP BUILDER SCREEN */}
      {!sessionActive && !sessionResults && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Cambridge IGCSE 0580 Chapter 17
              </span>
              <h2 className="text-2xl font-bold text-white">Targeted Practice Mode</h2>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {/* Topic Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Curriculum Topic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Topics' },
                  { id: 'earning', label: 'Earning Money' },
                  { id: 'interest', label: 'Simple Interest' },
                  { id: 'borrowing', label: 'Borrowing' },
                  { id: 'investing', label: 'Compound Growth' },
                  { id: 'profit_loss', label: 'Profit & Loss' },
                  { id: 'discount', label: 'Discounts & Sales' },
                  { id: 'financial_reasoning', label: 'Financial Reasoning' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTopic(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      selectedTopic === item.id
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level (Core vs Extended) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                IGCSE Syllabus Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('CORE')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedDifficulty === 'CORE'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  CORE (Grades C–G)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('EXTENDED')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedDifficulty === 'EXTENDED'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  EXTENDED (Grades A*–E)
                </button>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-base rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>START PRACTICE DRILL</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. ACTIVE SESSION DRILL */}
      {sessionActive && currentQ && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Header Progress */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Question {currentIndex + 1} of {sessionQuestions.length}
            </span>
            <span className="text-xs text-slate-400">
              {currentQ.subtopic}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-medium text-white mb-6 leading-relaxed whitespace-pre-line">
            {currentQ.questionText}
          </h3>

          {/* Form */}
          {answeredState === 'idle' ? (
            <div className="mb-6">
              {currentQ.options && currentQ.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setCurrentInput(opt);
                        handleSubmitCurrentAnswer(opt);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-amber-400 bg-slate-950 text-left text-sm text-slate-200 transition-all cursor-pointer"
                    >
                      <span className="w-6 inline-block font-mono text-slate-500">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitCurrentAnswer();
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter answer..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-mono text-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!currentInput.trim()}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold rounded-xl cursor-pointer"
                  >
                    Check
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Answered state */
            <div className="space-y-4 mb-6">
              {isAnswerCorrect(userAnswers[currentIndex] || '', currentQ.correctAnswer, currentQ.acceptableAnswers, currentQ.unit) ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-sm block">CORRECT!</span>
                    <span className="text-xs">Answer: {String(currentQ.correctAnswer)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-200 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <div>
                    <span className="font-bold text-sm block">NOT QUITE</span>
                    <span className="text-xs">Correct Answer: {String(currentQ.correctAnswer)} {currentQ.unit || ''}</span>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 block mb-1">Worked Solution:</span>
                {currentQ.solutionSteps.map((step, sIdx) => (
                  <p key={sIdx} className="font-mono">{step}</p>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex + 1 < sessionQuestions.length ? 'Next Question' : 'View Diagnostic Report'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DIAGNOSTIC REPORT RESULTS */}
      {sessionResults && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Performance Evaluation
              </span>
              <h2 className="text-2xl font-bold text-white">Practice Drill Diagnostic</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Score</span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {sessionResults.score} / {sessionResults.total}
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Accuracy</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {Math.round((sessionResults.score / sessionResults.total) * 100)}%
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Virtual XP Bonus</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                +{sessionResults.score * 25} XP
              </span>
            </div>
          </div>

          {/* Breakdown by Topic */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Topic Mastery Breakdown
            </h3>
            <div className="space-y-2">
              {Object.entries(sessionResults.topicStats).map(([topic, stat]) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                const isStrong = pct >= 70;
                return (
                  <div
                    key={topic}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white capitalize block">
                        {topic.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {stat.correct} of {stat.total} correct
                      </span>
                    </div>

                    <span className={`font-mono font-bold ${isStrong ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pct}% · {isStrong ? 'Strong' : 'Review Recommended'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => {
                setSessionResults(null);
                setSessionActive(false);
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Configure New Drill
            </button>
            <button
              onClick={handleStartSession}
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Retry Same Parameters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
