import React, { useState } from 'react';
import { PropertyData, PlayerProfile } from '../types/game';
import { generateQuestion } from '../engine/questionGenerator';
import { QuestionModal } from './QuestionModal';
import { soundFX } from '../utils/sound';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  ArrowUpCircle, 
  Check, 
  X, 
  Lock,
  Sparkles
} from 'lucide-react';

interface PropertyModalProps {
  property: PropertyData;
  player: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
  onAcquireProperty: (propertyId: string, cost: number) => void;
  onUpgradeProperty: (propertyId: string, cost: number) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  player,
  isOpen,
  onClose,
  onAcquireProperty,
  onUpgradeProperty,
}) => {
  const [activeChallengeType, setActiveChallengeType] = useState<'buy' | 'upgrade' | null>(null);

  if (!isOpen) return null;

  const isOwned = player.ownedPropertyIds.includes(property.id);
  const currentUpgradeLevel = player.propertyUpgrades[property.id] || 0;
  const currentIncome = currentUpgradeLevel > 0 ? property.upgradeIncome : property.baseIncome;
  
  const canAffordBuy = player.money >= property.basePrice;
  const canAffordUpgrade = player.money >= property.upgradeCost;
  const isMaxUpgraded = currentUpgradeLevel >= 1;

  // Start Math Challenge
  const handleStartMathChallenge = (action: 'buy' | 'upgrade') => {
    soundFX.playStep();
    setActiveChallengeType(action);
  };

  const handleChallengeSuccess = () => {
    if (activeChallengeType === 'buy') {
      soundFX.playPurchase();
      onAcquireProperty(property.id, property.basePrice);
    } else if (activeChallengeType === 'upgrade') {
      soundFX.playPurchase();
      onUpgradeProperty(property.id, property.upgradeCost);
    }
    setActiveChallengeType(null);
    onClose();
  };

  // If student started challenge, show QuestionModal with relevant financial math
  if (activeChallengeType) {
    const q = generateQuestion({
      topic: property.topic,
      difficulty: player.difficulty,
    });
    return (
      <QuestionModal
        isOpen={true}
        question={{
          ...q,
          contextTitle: activeChallengeType === 'buy'
            ? `Acquisition Audit: ${property.name}`
            : `Capital Upgrade Plan: ${property.name}`,
        }}
        player={player}
        onSuccess={handleChallengeSuccess}
        onClose={() => setActiveChallengeType(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Deed Title Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Commercial Title Deed
            </span>
            <h3 className="text-xl font-bold text-white">{property.name}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {property.description}
        </p>

        {/* Financial Deed Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Status</span>
            <span className="text-sm font-semibold text-white flex items-center gap-1.5">
              {isOwned ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Owned (Lvl {currentUpgradeLevel})</span>
                </>
              ) : (
                <span className="text-slate-400">Unclaimed</span>
              )}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Pass-Start Dividend</span>
            <span className="text-sm font-semibold text-emerald-400 font-mono tabular-nums flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span>+${currentIncome} / lap</span>
            </span>
          </div>
        </div>

        {/* Purchase / Upgrade Options */}
        <div className="space-y-3 mb-6">
          {!isOwned ? (
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Acquisition Cost</span>
                <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                  ${property.basePrice}
                </span>
              </div>

              <button
                onClick={() => handleStartMathChallenge('buy')}
                disabled={!canAffordBuy}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Solve & Acquire</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Upgrade to Level 1</span>
                {isMaxUpgraded ? (
                  <span className="text-xs font-semibold text-emerald-400">Maximum Upgrade</span>
                ) : (
                  <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
                    Cost: ${property.upgradeCost} · Dividend: +${property.upgradeIncome}/lap
                  </span>
                )}
              </div>

              {!isMaxUpgraded && (
                <button
                  onClick={() => handleStartMathChallenge('upgrade')}
                  disabled={!canAffordUpgrade}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Solve & Upgrade</span>
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Purchasing or upgrading requires passing a financial math check on {property.topic.replace('_', ' ')}.
        </p>
      </div>
    </div>
  );
};
