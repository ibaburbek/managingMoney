import React, { useState } from 'react';
import { LESSONS } from '../data/lessons';
import { LessonContent, TopicId } from '../types/game';
import { soundFX } from '../utils/sound';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Calculator,
  Sliders
} from 'lucide-react';

interface LearnViewProps {
  onStartPracticeTopic: (topic: TopicId) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onStartPracticeTopic }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('17.1');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('hourly_wages');
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Interactive Simulator States
  // 1. Wages Simulator
  const [simHours, setSimHours] = useState<number>(35);
  const [simRate, setSimRate] = useState<number>(15);
  const [simOtHours, setSimOtHours] = useState<number>(5);
  const [simOtMult, setSimOtMult] = useState<number>(1.5);

  // 2. Interest Simulator
  const [simPrincipal, setSimPrincipal] = useState<number>(2000);
  const [simInterestRate, setSimInterestRate] = useState<number>(5);
  const [simYears, setSimYears] = useState<number>(3);

  // 3. Profit / Loss Simulator
  const [simCost, setSimCost] = useState<number>(120);
  const [simSelling, setSimSelling] = useState<number>(150);

  // 4. Discount Simulator
  const [simOriginal, setSimOriginal] = useState<number>(200);
  const [simDiscount, setSimDiscount] = useState<number>(20);

  const activeChapter = LESSONS.find((c) => c.id === selectedChapterId) || LESSONS[0];
  const activeSubtopic = activeChapter.subtopics.find((s) => s.id === selectedSubtopicId) || activeChapter.subtopics[0];

  const handleSubtopicChange = (subId: string) => {
    setSelectedSubtopicId(subId);
    setQuickCheckAnswer(null);
    setIsAnswerSubmitted(false);
    soundFX.playStep();
  };

  const handleChapterChange = (chId: string) => {
    setSelectedChapterId(chId);
    const ch = LESSONS.find((c) => c.id === chId);
    if (ch && ch.subtopics.length > 0) {
      setSelectedSubtopicId(ch.subtopics[0].id);
    }
    setQuickCheckAnswer(null);
    setIsAnswerSubmitted(false);
    soundFX.playStep();
  };

  const handleQuickCheckSubmit = (index: number) => {
    setQuickCheckAnswer(index);
    setIsAnswerSubmitted(true);
    if (index === activeSubtopic.quickCheck.correctIndex) {
      soundFX.playCorrect();
    } else {
      soundFX.playWrong();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full text-slate-100">
      {/* Chapter Selection Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-800 pb-4">
        {LESSONS.map((ch) => {
          const isActive = ch.id === selectedChapterId;
          return (
            <button
              key={ch.id}
              onClick={() => handleChapterChange(ch.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{ch.chapterNumber} {ch.title}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SUBTOPICS SIDEBAR */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-2 mb-1">
            Lessons in {activeChapter.chapterNumber}
          </span>
          {activeChapter.subtopics.map((sub) => {
            const isSelected = sub.id === selectedSubtopicId;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubtopicChange(sub.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{sub.title}</span>
                <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>

        {/* MAIN LESSON CONTENT VIEW */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              Concept Breakdown · Cambridge IGCSE 0580
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {activeSubtopic.title}
            </h2>
            <p className="text-sm font-medium text-slate-300 italic">
              "{activeSubtopic.concept}"
            </p>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Theoretical Foundation
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {activeSubtopic.explanation}
            </p>
          </div>

          {/* Formula Callout */}
          {activeSubtopic.formula && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                <span>Cambridge Standard Formula</span>
              </h3>
              <pre className="text-sm sm:text-base font-mono font-semibold text-white whitespace-pre-wrap">
                {activeSubtopic.formula}
              </pre>
            </div>
          )}

          {/* WORKED EXAMPLE */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Exam-Standard Worked Example
            </h3>
            <p className="text-sm font-semibold text-white mb-3">
              {activeSubtopic.workedExample.question}
            </p>
            <div className="space-y-1.5 mb-3 border-l-2 border-slate-700 pl-3">
              {activeSubtopic.workedExample.steps.map((st, i) => (
                <p key={i} className="text-xs sm:text-sm font-mono text-slate-300">
                  {st}
                </p>
              ))}
            </div>
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-2.5 inline-block">
              Final Answer: {activeSubtopic.workedExample.answer}
            </div>
          </div>

          {/* INTERACTIVE SIMULATOR (Hands-on exploration) */}
          {activeSubtopic.interactiveSimulatorType === 'wages' && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Interactive Wage & Overtime Calculator</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Basic Hours: {simHours}h</label>
                  <input
                    type="range"
                    min={20}
                    max={45}
                    value={simHours}
                    onChange={(e) => setSimHours(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hourly Rate: ${simRate}/h</label>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    value={simRate}
                    onChange={(e) => setSimRate(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Overtime: {simOtHours}h</label>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={simOtHours}
                    onChange={(e) => setSimOtHours(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Multiplier: {simOtMult}×</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimOtMult(1.5)}
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold ${simOtMult === 1.5 ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 border-slate-700'}`}
                    >
                      1.5× (Time-and-a-half)
                    </button>
                    <button
                      onClick={() => setSimOtMult(2)}
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold ${simOtMult === 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 border-slate-700'}`}
                    >
                      2.0× (Double time)
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculated Result */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-slate-400">Total Gross Pay:</span>
                <span className="text-emerald-400 font-bold text-base">
                  ${simHours * simRate + simOtHours * (simRate * simOtMult)}
                </span>
              </div>
            </div>
          )}

          {activeSubtopic.interactiveSimulatorType === 'interest' && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Simple vs Compound Growth Simulator</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Principal: ${simPrincipal}</label>
                  <input
                    type="range"
                    min={1000}
                    max={10000}
                    step={500}
                    value={simPrincipal}
                    onChange={(e) => setSimPrincipal(Number(e.target.value))}
                    className="w-full accent-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rate: {simInterestRate}% p.a.</label>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={simInterestRate}
                    onChange={(e) => setSimInterestRate(Number(e.target.value))}
                    className="w-full accent-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time: {simYears} years</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={simYears}
                    onChange={(e) => setSimYears(Number(e.target.value))}
                    className="w-full accent-indigo-400"
                  />
                </div>
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[11px] mb-1">Simple Interest Total:</span>
                  <span className="text-white font-bold text-sm">
                    ${(simPrincipal + (simPrincipal * simInterestRate * simYears) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[11px] mb-1">Compound Total:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${(simPrincipal * Math.pow(1 + simInterestRate / 100, simYears)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* COMMON MISTAKE WARNING BOX */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                Common Exam Pitfall
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeSubtopic.commonMistake}
              </p>
            </div>
          </div>

          {/* QUICK CHECK QUESTION */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Quick Check Question</span>
            </h3>
            <p className="text-sm font-semibold text-white mb-4">
              {activeSubtopic.quickCheck.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {activeSubtopic.quickCheck.options.map((opt, oIdx) => {
                const isSelected = quickCheckAnswer === oIdx;
                const isCorrect = oIdx === activeSubtopic.quickCheck.correctIndex;
                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/70 border-rose-400 text-rose-200';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuickCheckSubmit(oIdx)}
                    disabled={isAnswerSubmitted}
                    className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">Explanation:</span>
                {activeSubtopic.quickCheck.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
