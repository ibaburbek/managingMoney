import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, Tile } from '../types/game';
import { BOARD_TILES } from '../data/boardTiles';
import { PROPERTIES } from '../data/properties';
import { HEROES } from '../data/heroes';
import { soundFX } from '../utils/sound';
import { 
  Dices, 
  Coins, 
  Sparkles, 
  Flame, 
  Building2, 
  Briefcase, 
  Landmark, 
  Percent, 
  TrendingUp, 
  Receipt, 
  Trophy, 
  Scale, 
  Flag,
  Coffee,
  BookOpen,
  Store,
  Laptop,
  Activity,
  Zap,
  Home,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface BoardViewProps {
  player: PlayerProfile;
  onTileTrigger: (tile: Tile, passedStart: boolean) => void;
  onInspectProperty: (propertyId: string) => void;
}

const TILE_ICON_MAP: Record<string, React.ReactNode> = {
  Flag: <Flag className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  ShoppingBag: <Store className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  Percent: <Percent className="w-5 h-5" />,
  CreditCard: <Coins className="w-5 h-5" />,
  Store: <Store className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Clock: <Briefcase className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Package: <Store className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Award: <Trophy className="w-5 h-5" />,
  ShieldCheck: <Landmark className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Building: <Building2 className="w-5 h-5" />,
  Tag: <Percent className="w-5 h-5" />,
  Compass: <Scale className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Key: <Coins className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
};

// 28-tile circuit coordinates on an 8x8 grid perimeter
// Top: tiles 14 to 21 (x: 0 to 7, y: 0)
// Right: tiles 21 to 27 (x: 7, y: 0 to 6)
// Bottom: tiles 0 to 7 (x: 0 to 7, y: 7) - or arranged in continuous clockwise loop
function getTileCoordinates(tileId: number): { row: number; col: number } {
  // Let's create an 8x8 square perimeter:
  // Bottom row (left to right): 0 to 7 (row 7, col 0..7)
  // Right col (bottom to top): 7 to 14 (col 7, row 7..0)
  // Top row (right to left): 14 to 21 (row 0, col 7..0)
  // Left col (top to bottom): 21 to 27 (col 0, row 0..6)
  if (tileId >= 0 && tileId <= 7) {
    return { row: 7, col: tileId };
  } else if (tileId > 7 && tileId <= 14) {
    return { row: 7 - (tileId - 7), col: 7 };
  } else if (tileId > 14 && tileId <= 21) {
    return { row: 0, col: 7 - (tileId - 14) };
  } else {
    return { row: tileId - 21, col: 0 };
  }
}

export const BoardView: React.FC<BoardViewProps> = ({
  player,
  onTileTrigger,
  onInspectProperty,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [currentStepPosition, setCurrentStepPosition] = useState(player.position);
  const [inspectedTileId, setInspectedTileId] = useState<number>(player.position);
  const [startPassMessage, setStartPassMessage] = useState<string | null>(null);

  const hero = HEROES[player.heroId];
  const inspectedTile = BOARD_TILES[inspectedTileId] || BOARD_TILES[0];

  useEffect(() => {
    setCurrentStepPosition(player.position);
  }, [player.position]);

  const handleRollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    soundFX.playDiceRoll();

    // Animate dice face flickering
    let rollCounter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCounter++;
      if (rollCounter >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        animateMovement(finalRoll);
      }
    }, 80);
  };

  const animateMovement = (steps: number) => {
    let current = player.position;
    let stepCount = 0;
    let passedStart = false;

    const stepInterval = setInterval(() => {
      stepCount++;
      current = (current + 1) % 28;
      setCurrentStepPosition(current);
      soundFX.playStep();

      if (current === 0) {
        passedStart = true;
      }

      if (stepCount >= steps) {
        clearInterval(stepInterval);
        setIsRolling(false);
        setInspectedTileId(current);

        if (passedStart) {
          // Calculate dividend
          let dividend = 150;
          player.ownedPropertyIds.forEach((pid) => {
            const prop = PROPERTIES[pid];
            if (prop) {
              const lvl = player.propertyUpgrades[pid] || 0;
              dividend += lvl > 0 ? prop.upgradeIncome : prop.baseIncome;
            }
          });
          setStartPassMessage(`Passed START! Collected $${dividend} ($150 salary + dividends)`);
          soundFX.playCoin();
          setTimeout(() => setStartPassMessage(null), 4000);
        }

        // Trigger tile action
        const finalTile = BOARD_TILES[current];
        onTileTrigger(finalTile, passedStart);
      }
    }, 220);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 w-full text-slate-100">
      {/* Passing START Dividend Notification Banner */}
      {startPassMessage && (
        <div className="mb-3 p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg flex items-center justify-between text-sm font-semibold animate-bounce">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span>{startPassMessage}</span>
          </div>
          <button
            onClick={() => setStartPassMessage(null)}
            className="text-xs text-white/80 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP HUD BAR */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hero.avatarColor} flex items-center justify-center text-white font-bold shrink-0 shadow-inner`}>
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{player.name}</p>
            <p className="text-[11px] text-amber-400 truncate">Lvl {player.level} {player.difficulty}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Coins className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-400 block">Virtual Funds</span>
            <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
              ${player.money.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span>XP Progress</span>
              <span className="font-mono tabular-nums">{player.xp} / {player.xpToNextLevel}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Flame className={`w-5 h-5 ${player.currentStreak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'} shrink-0`} />
          <div>
            <span className="text-[11px] text-slate-400 block">Answer Streak</span>
            <span className="text-sm font-bold font-mono text-white tabular-nums">
              {player.currentStreak} in a row
            </span>
          </div>
        </div>
      </div>

      {/* BOARD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* DESKTOP 8x8 PERIMETER BOARD CONTAINER */}
        <div className="lg:col-span-8 bg-slate-950 p-2 sm:p-3 rounded-3xl border border-slate-800 shadow-2xl relative">
          {/* 8x8 CSS Grid representing Money Quest City */}
          <div className="grid grid-cols-8 grid-rows-8 gap-1 aspect-square w-full">
            {BOARD_TILES.map((tile) => {
              const coords = getTileCoordinates(tile.id);
              const isPlayerHere = currentStepPosition === tile.id;
              const isInspected = inspectedTileId === tile.id;
              const isProperty = tile.category === 'property';
              const isOwned = tile.propertyId && player.ownedPropertyIds.includes(tile.propertyId);

              // Border/category colors
              let categoryBg = 'bg-slate-900';
              let borderAccent = 'border-slate-800';
              if (tile.category === 'start') {
                categoryBg = 'bg-emerald-950/70';
                borderAccent = 'border-emerald-500/50';
              } else if (tile.category === 'job') {
                categoryBg = 'bg-blue-950/50';
                borderAccent = 'border-blue-500/40';
              } else if (tile.category === 'bank') {
                categoryBg = 'bg-indigo-950/50';
                borderAccent = 'border-indigo-500/40';
              } else if (tile.category === 'shop') {
                categoryBg = 'bg-amber-950/50';
                borderAccent = 'border-amber-500/40';
              } else if (tile.category === 'property') {
                categoryBg = isOwned ? 'bg-emerald-950/80' : 'bg-slate-900';
                borderAccent = isOwned ? 'border-emerald-400' : 'border-amber-500/40';
              } else if (tile.category === 'challenge') {
                categoryBg = 'bg-rose-950/50';
                borderAccent = 'border-rose-500/50';
              }

              return (
                <button
                  key={tile.id}
                  onClick={() => setInspectedTileId(tile.id)}
                  style={{
                    gridColumnStart: coords.col + 1,
                    gridRowStart: coords.row + 1,
                  }}
                  className={`relative p-1 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none overflow-hidden ${categoryBg} ${borderAccent} ${
                    isInspected ? 'ring-2 ring-amber-400' : ''
                  } ${isPlayerHere ? 'shadow-lg shadow-amber-400/30' : ''}`}
                >
                  {/* Tile ID badge */}
                  <span className="text-[9px] font-mono text-slate-500 self-start leading-none">
                    {tile.id}
                  </span>

                  {/* Icon */}
                  <div className="text-slate-300 transform scale-75 sm:scale-90">
                    {TILE_ICON_MAP[tile.iconName] || <Store className="w-4 h-4" />}
                  </div>

                  {/* Name */}
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-200 line-clamp-1 leading-tight px-0.5">
                    {tile.name}
                  </span>

                  {/* Property Owned Deed Dot */}
                  {isProperty && isOwned && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                  )}

                  {/* Player Token Avatar Pin */}
                  {isPlayerHere && (
                    <div className="absolute inset-0 bg-amber-400/25 flex items-center justify-center pointer-events-none">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr ${hero.avatarColor} ring-2 ring-white shadow-xl flex items-center justify-center text-white text-[11px] font-bold animate-bounce`}>
                        {player.name.charAt(0)}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* CENTER HUB of the 8x8 Board (Occupies col 2 to 7, row 2 to 7) */}
            <div
              style={{
                gridColumnStart: 2,
                gridColumnEnd: 8,
                gridRowStart: 2,
                gridRowEnd: 8,
              }}
              className="p-3 sm:p-6 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden"
            >
              <div className="absolute top-2 left-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Money Quest City · Chapter 17
              </div>

              {/* 3D Dice Display */}
              <div className="mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300 text-slate-950 shadow-2xl flex items-center justify-center border-2 border-amber-400 ring-4 ring-amber-400/20 transform transition-transform">
                  {diceValue !== null ? (
                    <span className="text-3xl sm:text-4xl font-black font-mono">
                      {diceValue}
                    </span>
                  ) : (
                    <Dices className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Large Animated ROLL DICE Button */}
              <button
                onClick={handleRollDice}
                disabled={isRolling}
                className="w-full max-w-xs py-3 sm:py-3.5 px-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl text-base sm:text-lg shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isRolling ? 'MOVING...' : 'ROLL DICE'}</span>
              </button>

              <p className="mt-3 text-xs text-slate-400">
                Current Position: Space #{currentStepPosition} ({BOARD_TILES[currentStepPosition]?.name})
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR: SPACE INSPECTOR & PROPERTY SUMMARY */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected / Current Tile Inspector */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Space #{inspectedTile.id} Inspector
              </span>
              <span className="text-xs font-mono text-slate-400 capitalize">
                {inspectedTile.category}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200">
                {TILE_ICON_MAP[inspectedTile.iconName] || <Store className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {inspectedTile.name}
                </h3>
                {inspectedTile.topic && (
                  <p className="text-xs text-slate-400 capitalize">
                    Skill: {inspectedTile.topic.replace('_', ' ')}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {inspectedTile.description}
            </p>

            {inspectedTile.propertyId && (
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => onInspectProperty(inspectedTile.propertyId!)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>View Property Deed</span>
                </button>
              </div>
            )}
          </div>

          {/* Real Estate Portfolio Quick Drawer */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Owned Properties ({player.ownedPropertyIds.length}/8)</span>
              </h3>
            </div>

            {player.ownedPropertyIds.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No properties owned yet. Land on a commercial space to acquire deeds!
              </p>
            ) : (
              <div className="space-y-2">
                {player.ownedPropertyIds.map((pid) => {
                  const prop = PROPERTIES[pid];
                  if (!prop) return null;
                  const lvl = player.propertyUpgrades[pid] || 0;
                  const inc = lvl > 0 ? prop.upgradeIncome : prop.baseIncome;

                  return (
                    <div
                      key={pid}
                      onClick={() => onInspectProperty(pid)}
                      className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white block">{prop.name}</span>
                        <span className="text-[10px] text-slate-400">Level {lvl}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-semibold">
                        +${inc}/lap
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
