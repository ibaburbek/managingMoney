/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GameDifficulty, 
  HeroId, 
  PlayerProfile, 
  Question, 
  Tile, 
  TopicId, 
  PropertyData 
} from './types/game';
import { 
  loadPlayerProfile, 
  savePlayerProfile, 
  createNewPlayer, 
  calculateLevel, 
  checkNewAchievements 
} from './utils/storage';
import { soundFX } from './utils/sound';
import { generateQuestion } from './engine/questionGenerator';
import { PROPERTIES } from './data/properties';
import { getTodayDateString } from './engine/dailyChallenge';

// Components
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { HeroCreationModal } from './components/HeroCreationModal';
import { BoardView } from './components/BoardView';
import { QuestionModal } from './components/QuestionModal';
import { PropertyModal } from './components/PropertyModal';
import { LearnView } from './components/LearnView';
import { PracticeView } from './components/PracticeView';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { LevelUpModal } from './components/LevelUpModal';

export default function App() {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'board' | 'learn' | 'practice' | 'dashboard'>('home');
  
  // Modals
  const [showHeroModal, setShowHeroModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<{ show: boolean; level: number; title: string }>({
    show: false,
    level: 1,
    title: '',
  });

  // Active Tile / Question States
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeProperty, setActiveProperty] = useState<PropertyData | null>(null);

  // Practice shortcut
  const [practiceTopic, setPracticeTopic] = useState<TopicId | undefined>(undefined);

  // Audio State
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Load existing profile from storage on mount
  useEffect(() => {
    const saved = loadPlayerProfile();
    if (saved) {
      setPlayer(saved);
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundFX.setMuted(next);
  };

  // Profile creation handler
  const handleCompleteHeroCreation = (name: string, heroId: HeroId, difficulty: GameDifficulty) => {
    const newP = createNewPlayer(name, heroId, difficulty);
    setPlayer(newP);
    savePlayerProfile(newP);
    setShowHeroModal(false);
    setCurrentView('board');
  };

  // Trigger when landing on a tile after rolling
  const handleTileTrigger = (tile: Tile, passedStart: boolean) => {
    if (!player) return;

    let updatedMoney = player.money;

    // Handle passed START dividend collection
    if (passedStart) {
      let dividend = 150; // base stipend
      player.ownedPropertyIds.forEach((pid) => {
        const prop = PROPERTIES[pid];
        if (prop) {
          const lvl = player.propertyUpgrades[pid] || 0;
          dividend += lvl > 0 ? prop.upgradeIncome : prop.baseIncome;
        }
      });
      updatedMoney += dividend;
    }

    // Update position and money immediately
    const updatedProfile: PlayerProfile = {
      ...player,
      position: tile.id,
      money: updatedMoney,
    };

    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);

    // If landed on a commercial property tile
    if (tile.category === 'property' && tile.propertyId) {
      const prop = PROPERTIES[tile.propertyId];
      if (prop) {
        setActiveProperty(prop);
        return;
      }
    }

    // For all other spaces (Job, Bank, Shop, Tax, Advisor, Challenge, Event, Start)
    // Generate a mathematically validated question tailored to the space topic and student difficulty
    const topicToUse = tile.topic || 'financial_reasoning';
    const q = generateQuestion({
      topic: topicToUse,
      difficulty: player.difficulty,
      historySignatures: player.questionHistorySignatures,
    });

    setActiveQuestion({
      ...q,
      contextTitle: `${tile.name} · Space #${tile.id}`,
    });
  };

  // Question Success callback
  const handleQuestionSuccess = (earnedXp: number, earnedMoney: number, topic: TopicId) => {
    if (!player) return;

    const newXp = player.xp + earnedXp;
    const newMoney = player.money + earnedMoney;
    const newStreak = player.currentStreak + 1;
    const bestStreak = Math.max(newStreak, player.bestStreak);
    const newTotalAnswered = player.totalAnswered + 1;
    const newTotalCorrect = player.totalCorrect + 1;

    // Update Skill Mastery
    const currentSkill = player.skillMastery[topic] || { correct: 0, total: 0, percentage: 0 };
    const updatedTopicMastery = {
      correct: currentSkill.correct + 1,
      total: currentSkill.total + 1,
      percentage: Math.round(((currentSkill.correct + 1) / (currentSkill.total + 1)) * 100),
    };

    // Calculate level progression
    const levelInfo = calculateLevel(newXp);
    const hasLeveledUp = levelInfo.level > player.level;

    // Track anti-duplicate signature
    const newHistory = activeQuestion 
      ? [...player.questionHistorySignatures.slice(-30), activeQuestion.signature] 
      : player.questionHistorySignatures;

    let updatedProfile: PlayerProfile = {
      ...player,
      xp: newXp,
      level: levelInfo.level,
      xpToNextLevel: levelInfo.nextLevelXp,
      money: hasLeveledUp ? newMoney + levelInfo.level * 100 : newMoney, // Level up stipend bonus
      currentStreak: newStreak,
      bestStreak,
      totalAnswered: newTotalAnswered,
      totalCorrect: newTotalCorrect,
      questionHistorySignatures: newHistory,
      skillMastery: {
        ...player.skillMastery,
        [topic]: updatedTopicMastery,
      },
    };

    // Check achievements
    const achCheck = checkNewAchievements(updatedProfile);
    updatedProfile = achCheck.updatedProfile;

    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);

    setActiveQuestion(null);

    // If leveled up, show celebration modal
    if (hasLeveledUp) {
      setLevelUpData({
        show: true,
        level: levelInfo.level,
        title: levelInfo.title,
      });
    }
  };

  // Property Acquisition
  const handleAcquireProperty = (propertyId: string, cost: number) => {
    if (!player) return;
    const updatedProfile: PlayerProfile = {
      ...player,
      money: Math.max(0, player.money - cost),
      ownedPropertyIds: [...player.ownedPropertyIds, propertyId],
      propertyUpgrades: {
        ...player.propertyUpgrades,
        [propertyId]: 0,
      },
    };

    const achCheck = checkNewAchievements(updatedProfile);
    setPlayer(achCheck.updatedProfile);
    savePlayerProfile(achCheck.updatedProfile);
    setActiveProperty(null);
  };

  // Property Upgrade
  const handleUpgradeProperty = (propertyId: string, cost: number) => {
    if (!player) return;
    const currentLvl = player.propertyUpgrades[propertyId] || 0;
    const updatedProfile: PlayerProfile = {
      ...player,
      money: Math.max(0, player.money - cost),
      propertyUpgrades: {
        ...player.propertyUpgrades,
        [propertyId]: currentLvl + 1,
      },
    };

    const achCheck = checkNewAchievements(updatedProfile);
    setPlayer(achCheck.updatedProfile);
    savePlayerProfile(achCheck.updatedProfile);
    setActiveProperty(null);
  };

  // Daily Challenge Success
  const handleDailySuccess = (earnedXp: number, earnedMoney: number) => {
    if (!player) return;
    const todayStr = getTodayDateString();
    const newXp = player.xp + earnedXp;
    const newMoney = player.money + earnedMoney;
    const levelInfo = calculateLevel(newXp);
    const hasLeveledUp = levelInfo.level > player.level;

    let updatedProfile: PlayerProfile = {
      ...player,
      xp: newXp,
      level: levelInfo.level,
      xpToNextLevel: levelInfo.nextLevelXp,
      money: hasLeveledUp ? newMoney + levelInfo.level * 100 : newMoney,
      lastDailyChallengeDate: todayStr,
      totalAnswered: player.totalAnswered + 1,
      totalCorrect: player.totalCorrect + 1,
      currentStreak: player.currentStreak + 1,
      bestStreak: Math.max(player.bestStreak, player.currentStreak + 1),
    };

    const achCheck = checkNewAchievements(updatedProfile);
    updatedProfile = achCheck.updatedProfile;

    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);

    if (hasLeveledUp) {
      setLevelUpData({
        show: true,
        level: levelInfo.level,
        title: levelInfo.title,
      });
    }
  };

  // Practice session completion
  const handleFinishPractice = (earnedXp: number, correctCount: number) => {
    if (!player) return;
    const newXp = player.xp + earnedXp;
    const levelInfo = calculateLevel(newXp);
    const hasLeveledUp = levelInfo.level > player.level;

    let updatedProfile: PlayerProfile = {
      ...player,
      xp: newXp,
      level: levelInfo.level,
      xpToNextLevel: levelInfo.nextLevelXp,
      money: hasLeveledUp ? player.money + levelInfo.level * 100 : player.money,
      totalAnswered: player.totalAnswered + 5,
      totalCorrect: player.totalCorrect + correctCount,
    };

    const achCheck = checkNewAchievements(updatedProfile);
    updatedProfile = achCheck.updatedProfile;

    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);

    if (hasLeveledUp) {
      setLevelUpData({
        show: true,
        level: levelInfo.level,
        title: levelInfo.title,
      });
    }
  };

  // Reset all progress
  const handleResetProgress = () => {
    localStorage.removeItem('money_quest_player_profile_v1');
    setPlayer(null);
    setCurrentView('home');
  };

  // Switch difficulty in settings
  const handleUpdateDifficulty = (difficulty: GameDifficulty) => {
    if (!player) return;
    const updated = { ...player, difficulty };
    setPlayer(updated);
    savePlayerProfile(updated);
  };

  // Navigate to Practice with a specific topic from Learn View
  const handleStartPracticeTopic = (topic: TopicId) => {
    setPracticeTopic(topic);
    setCurrentView('practice');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          soundFX.playStep();
          setCurrentView(view);
        }}
        player={player}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenDaily={() => setShowDailyModal(true)}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomeView
            player={player}
            onPlay={() => {
              soundFX.playStep();
              if (player) {
                setCurrentView('board');
              } else {
                setShowHeroModal(true);
              }
            }}
            onNewGame={() => {
              soundFX.playStep();
              setShowHeroModal(true);
            }}
            onLearn={() => {
              soundFX.playStep();
              setCurrentView('learn');
            }}
            onPractice={() => {
              soundFX.playStep();
              setCurrentView('practice');
            }}
            onSettings={() => setShowSettingsModal(true)}
          />
        )}

        {currentView === 'board' && player && (
          <BoardView
            player={player}
            onTileTrigger={handleTileTrigger}
            onInspectProperty={(pid) => {
              const prop = PROPERTIES[pid];
              if (prop) setActiveProperty(prop);
            }}
          />
        )}

        {currentView === 'learn' && (
          <LearnView onStartPracticeTopic={handleStartPracticeTopic} />
        )}

        {currentView === 'practice' && (
          <PracticeView
            initialTopic={practiceTopic}
            defaultDifficulty={player?.difficulty || 'CORE'}
            onFinishSession={handleFinishPractice}
          />
        )}

        {currentView === 'dashboard' && player && (
          <DashboardView
            player={player}
            onContinueGame={() => {
              soundFX.playStep();
              setCurrentView('board');
            }}
            onLearn={() => {
              soundFX.playStep();
              setCurrentView('learn');
            }}
            onPractice={() => {
              soundFX.playStep();
              setCurrentView('practice');
            }}
            onDaily={() => setShowDailyModal(true)}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Hero Creation */}
      <HeroCreationModal
        isOpen={showHeroModal}
        onClose={player ? () => setShowHeroModal(false) : undefined}
        onComplete={handleCompleteHeroCreation}
      />

      {/* 2. Chapter 17 Mathematical Question Modal */}
      {activeQuestion && player && (
        <QuestionModal
          question={activeQuestion}
          player={player}
          isOpen={true}
          onSuccess={handleQuestionSuccess}
          onClose={() => setActiveQuestion(null)}
        />
      )}

      {/* 3. Property Deed & Investment Modal */}
      {activeProperty && player && (
        <PropertyModal
          property={activeProperty}
          player={player}
          isOpen={true}
          onClose={() => setActiveProperty(null)}
          onAcquireProperty={handleAcquireProperty}
          onUpgradeProperty={handleUpgradeProperty}
        />
      )}

      {/* 4. Daily Money Challenge Modal */}
      {player && (
        <DailyChallengeModal
          player={player}
          isOpen={showDailyModal}
          onClose={() => setShowDailyModal(false)}
          onSuccess={handleDailySuccess}
        />
      )}

      {/* 5. Game Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        player={player}
        onUpdateDifficulty={handleUpdateDifficulty}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onResetProgress={handleResetProgress}
      />

      {/* 6. Level Up Fanfare Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpData.show}
        newLevel={levelUpData.level}
        levelTitle={levelUpData.title}
        onClose={() => setLevelUpData((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
