import React, { useState, useEffect, useRef } from 'react';
import {
  BoardCell,
  LevelConfig,
  PlayerProgress,
  Position,
  ActiveBooster,
} from './types';
import { getLevelConfig } from './utils/levels';
import {
  createInitialBoard,
  isValidSwap,
  executeSwapAndCascade,
  applyHammer,
  findHintMove,
} from './utils/gameLogic';
import { sound } from './utils/sound';
import { HeaderHUD } from './components/HeaderHUD';
import { GameBoard } from './components/GameBoard';
import { BoostersPanel } from './components/BoostersPanel';
import { LevelMap } from './components/LevelMap';
import { DailySpin } from './components/DailySpin';
import { ShopModal } from './components/ShopModal';
import { GameOverModal } from './components/GameOverModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PlayerAnalyticsModal } from './components/PlayerAnalyticsModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { DailyStreakModal } from './components/DailyStreakModal';
import { WeeklyChallengesModal } from './components/WeeklyChallengesModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { WorldAmbientEffect } from './components/WorldAmbientEffect';
import { getWorldThemeByLevelId } from './utils/worldThemes';
import { hasUnclaimedAchievements } from './utils/achievements';
import {
  getOrGenerateDailyMissions,
  updateDailyMissionProgress,
  hasUnclaimedMissions,
} from './utils/dailyMissions';
import { isFreeSpinAvailable } from './utils/luckyWheel';
import { getStreakInfo } from './utils/dailyStreak';
import {
  getOrGenerateWeeklyChallenges,
  updateWeeklyChallengeProgress,
  hasUnclaimedWeeklyChallenges,
  ALL_PROFILE_BADGES,
} from './utils/weeklyChallenges';
import { DailyMissionType, DailyStreakData, DailyStreakReward } from './types';

const INITIAL_PROGRESS: PlayerProgress = {
  unlockedLevel: 1,
  stars: {},
  highScores: {},
  coins: 200,
  boosters: {
    hammer: 2,
    freeSwap: 2,
    colorBombStart: 1,
    stripedStart: 1,
    extraMoves: 2,
  },
};

export default function App() {
  const [view, setView] = useState<'MAP' | 'GAME'>('MAP');

  // Player progress stored in localStorage
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem('candy_saga_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROGRESS;
      }
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('candy_saga_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const handleFirstUserInteraction = () => {
      sound.ensureBgmStarted();
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

  // Modals state
  const [showDailyStreak, setShowDailyStreak] = useState(false);
  const [showDailySpin, setShowDailySpin] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showWeeklyChallenges, setShowWeeklyChallenges] = useState(false);
  const [leaderboardLevelId, setLeaderboardLevelId] = useState(1);

  // Initialize and check daily missions, weekly challenges, streak & free spin
  useEffect(() => {
    setProgress((prev) => {
      const currentMissions = getOrGenerateDailyMissions(prev.dailyMissions);
      const currentWeekly = getOrGenerateWeeklyChallenges(prev.weeklyChallenges);
      return {
        ...prev,
        dailyMissions: currentMissions,
        weeklyChallenges: currentWeekly,
      };
    });

    if (getStreakInfo(progress.dailyStreak).canClaimToday) {
      setShowDailyStreak(true);
    } else if (isFreeSpinAvailable(progress.lastSpinDate)) {
      setShowDailySpin(true);
    }
  }, []);

  const trackMissionUpdates = (updates: { type: DailyMissionType | string; amount?: number }[]) => {
    setProgress((prev) => {
      const currentMissions = getOrGenerateDailyMissions(prev.dailyMissions);
      const { updatedData: updatedDaily } = updateDailyMissionProgress(currentMissions, updates as any);

      const currentWeekly = getOrGenerateWeeklyChallenges(prev.weeklyChallenges);
      const { updatedData: updatedWeekly } = updateWeeklyChallengeProgress(currentWeekly, updates);

      return {
        ...prev,
        dailyMissions: updatedDaily,
        weeklyChallenges: updatedWeekly,
      };
    });
  };

  const handleClaimMissionReward = (missionId: string, rewardCoins: number) => {
    setProgress((prev) => {
      if (!prev.dailyMissions) return prev;
      const updatedMissions = prev.dailyMissions.missions.map((m) =>
        m.id === missionId ? { ...m, isClaimed: true } : m
      );
      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        dailyMissions: {
          ...prev.dailyMissions,
          missions: updatedMissions,
        },
      };
    });
    sound.playCoin();
  };

  const handleClaimWeeklyChallenge = (challengeId: string) => {
    setProgress((prev) => {
      if (!prev.weeklyChallenges) return prev;
      const currentWeekly = getOrGenerateWeeklyChallenges(prev.weeklyChallenges);
      const challenge = currentWeekly.challenges.find((c) => c.id === challengeId);
      if (!challenge || challenge.isClaimed) return prev;

      const updatedChallenges = currentWeekly.challenges.map((c) =>
        c.id === challengeId ? { ...c, isClaimed: true } : c
      );

      const newBoosters = { ...prev.boosters };
      if (challenge.rewardBoosters) {
        if (challenge.rewardBoosters.hammer) newBoosters.hammer += challenge.rewardBoosters.hammer;
        if (challenge.rewardBoosters.freeSwap) newBoosters.freeSwap += challenge.rewardBoosters.freeSwap;
        if (challenge.rewardBoosters.colorBombStart)
          newBoosters.colorBombStart += challenge.rewardBoosters.colorBombStart;
        if (challenge.rewardBoosters.stripedStart)
          newBoosters.stripedStart += challenge.rewardBoosters.stripedStart;
        if (challenge.rewardBoosters.extraMoves)
          newBoosters.extraMoves += challenge.rewardBoosters.extraMoves;
      }

      const unlockedBadges = [...(currentWeekly.unlockedBadgeIds || [])];
      if (challenge.rewardBadge && !unlockedBadges.includes(challenge.rewardBadge.id)) {
        unlockedBadges.push(challenge.rewardBadge.id);
      }

      const autoEquippedBadgeId =
        currentWeekly.equippedBadgeId || (challenge.rewardBadge ? challenge.rewardBadge.id : undefined);

      return {
        ...prev,
        coins: prev.coins + challenge.rewardCoins,
        boosters: newBoosters,
        weeklyChallenges: {
          ...currentWeekly,
          challenges: updatedChallenges,
          unlockedBadgeIds: unlockedBadges,
          equippedBadgeId: autoEquippedBadgeId,
        },
      };
    });
    sound.playCoin();
  };

  const handleEquipBadge = (badgeId: string | undefined) => {
    setProgress((prev) => {
      if (!prev.weeklyChallenges) return prev;
      return {
        ...prev,
        weeklyChallenges: {
          ...prev.weeklyChallenges,
          equippedBadgeId: badgeId,
        },
      };
    });
  };

  // Active Level state
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig | null>(null);
  const [board, setBoard] = useState<BoardCell[][]>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(0);
  const [jellyLeft, setJellyLeft] = useState(0);
  const [ingredientsLeft, setIngredientsLeft] = useState(0);
  const [collectedColors, setCollectedColors] = useState<Record<string, number>>({});
  const [activeBooster, setActiveBooster] = useState<ActiveBooster>('none');
  const [hint, setHint] = useState<{ posA: Position; posB: Position } | null>(null);
  const [comboMessage, setComboMessage] = useState<string | null>(null);

  // Game over state
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Idle timer for hint detection
  const hintTimerRef = useRef<number | null>(null);

  // Start Level
  const handleStartLevel = (levelConfig: LevelConfig) => {
    sound.ensureBgmStarted();
    setCurrentLevelConfig(levelConfig);
    const newBoard = createInitialBoard(levelConfig);

    setBoard(newBoard);
    setScore(0);
    setMovesLeft(levelConfig.moves);

    // Calculate initial jelly count
    let initialJelly = 0;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[0].length; c++) {
        if (newBoard[r][c].blocker === 'jelly-1') {
          initialJelly++;
        }
      }
    }
    setJellyLeft(initialJelly);
    setIngredientsLeft(levelConfig.ingredientsToDrop || 0);
    setCollectedColors({});
    setActiveBooster('none');
    setComboMessage(null);
    setIsGameOver(false);
    setIsWin(false);

    setView('GAME');
  };

  // Reset hint timer whenever board or moves change
  useEffect(() => {
    if (view !== 'GAME' || isGameOver || !board.length) return;

    setHint(null);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

    hintTimerRef.current = window.setTimeout(() => {
      const foundHint = findHintMove(board);
      if (foundHint) {
        setHint(foundHint);
      }
    }, 5000);

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [board, view, isGameOver]);

  // Handle Swap logic
  const handleSwap = (posA: Position, posB: Position) => {
    if (isGameOver || !currentLevelConfig || movesLeft <= 0) return;

    // Handle Free Swap booster
    if (activeBooster === 'freeSwap') {
      const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
      const candyA = newBoard[posA.row][posA.col].candy;
      const candyB = newBoard[posB.row][posB.col].candy;

      newBoard[posA.row][posA.col].candy = candyB;
      newBoard[posB.row][posB.col].candy = candyA;

      setBoard(newBoard);
      setActiveBooster('none');
      setProgress((prev) => ({
        ...prev,
        boosters: { ...prev.boosters, freeSwap: Math.max(0, prev.boosters.freeSwap - 1) },
      }));
      trackMissionUpdates([{ type: 'use_booster', amount: 1 }]);
      sound.playSwap();
      return;
    }

    if (!isValidSwap(board, posA, posB)) {
      sound.playInvalid();
      return;
    }

    sound.playSwap();

    // Deduct move
    const remainingMoves = movesLeft - 1;
    setMovesLeft(remainingMoves);

    // Execute match cascade
    const { steps, updatedBoard } = executeSwapAndCascade(
      board,
      posA,
      posB,
      currentLevelConfig.allowedColors
    );

    setBoard(updatedBoard);

    // Calculate gained stats across cascade steps
    let gainedScore = 0;
    let gainedJelly = 0;
    let gainedIngredients = 0;
    let gainedSpecials = 0;
    let gainedStriped = 0;
    let gainedWrapped = 0;
    let gainedColorBomb = 0;
    let matchedRed = 0;
    let matchedBlue = 0;
    let matchedGreen = 0;
    let maxCombo = 0;
    let specialComboName = '';

    for (const step of steps) {
      gainedScore += step.scoreGained;
      gainedJelly += step.jellyCleared;
      gainedIngredients += step.ingredientsCollected;
      if (step.createdSpecials && step.createdSpecials.length > 0) {
        gainedSpecials += step.createdSpecials.length;
        for (const s of step.createdSpecials) {
          if (s.candy.type === 'striped-h' || s.candy.type === 'striped-v') gainedStriped++;
          if (s.candy.type === 'wrapped') gainedWrapped++;
          if (s.candy.type === 'color-bomb') gainedColorBomb++;
        }
      }
      if (step.specialComboName) {
        gainedSpecials += 1;
      }

      for (const pos of step.clearedPositions) {
        const c = board[pos.row]?.[pos.col]?.candy;
        if (c) {
          if (c.color === 'red') matchedRed++;
          if (c.color === 'blue') matchedBlue++;
          if (c.color === 'green') matchedGreen++;
        }
      }

      if (step.comboLevel > maxCombo) maxCombo = step.comboLevel;
      if (step.specialComboName) specialComboName = step.specialComboName;
    }

    // Daily Mission tracking
    const missionUpdates: { type: DailyMissionType; amount?: number }[] = [];
    if (gainedScore > 0) missionUpdates.push({ type: 'score_points', amount: gainedScore });
    if (gainedJelly > 0) missionUpdates.push({ type: 'clear_jelly', amount: gainedJelly });
    if (gainedStriped > 0) missionUpdates.push({ type: 'create_striped', amount: gainedStriped });
    if (gainedWrapped > 0) missionUpdates.push({ type: 'create_wrapped', amount: gainedWrapped });
    if (gainedColorBomb > 0) missionUpdates.push({ type: 'create_color_bomb', amount: gainedColorBomb });
    if (matchedRed > 0) missionUpdates.push({ type: 'match_red', amount: matchedRed });
    if (matchedBlue > 0) missionUpdates.push({ type: 'match_blue', amount: matchedBlue });
    if (matchedGreen > 0) missionUpdates.push({ type: 'match_green', amount: matchedGreen });

    if (missionUpdates.length > 0) {
      trackMissionUpdates(missionUpdates);
    }

    // Update cumulative player stats
    setProgress((prev) => {
      const curStats = prev.stats || {
        totalJelliesCleared: 0,
        totalScore: 0,
        levelsCompleted: 0,
        totalStars: 0,
        totalSpecialCandies: 0,
        totalSpins: 0,
      };
      return {
        ...prev,
        stats: {
          ...curStats,
          totalScore: curStats.totalScore + gainedScore,
          totalJelliesCleared: curStats.totalJelliesCleared + gainedJelly,
          totalSpecialCandies: curStats.totalSpecialCandies + gainedSpecials,
        },
      };
    });

    // Play match audio feedback
    sound.playMatch(maxCombo);

    // Popup Combo Messages
    if (specialComboName) {
      triggerComboMessage(specialComboName);
    } else if (maxCombo >= 4) {
      triggerComboMessage('⚡ SUGAR RUSH!');
    } else if (maxCombo === 3) {
      triggerComboMessage('🔥 DELICIOUS!');
    } else if (maxCombo === 2) {
      triggerComboMessage('✨ TASTY!');
    } else if (gainedScore >= 500) {
      triggerComboMessage('🍬 SWEET!');
    }

    // Update state variables
    const newScore = score + gainedScore;
    const newJelly = Math.max(0, jellyLeft - gainedJelly);
    const newIngredients = Math.max(0, ingredientsLeft - gainedIngredients);

    setScore(newScore);
    setJellyLeft(newJelly);
    setIngredientsLeft(newIngredients);

    // Check level win / loss objective status
    checkObjectiveCompletion(
      currentLevelConfig,
      newScore,
      newJelly,
      newIngredients,
      remainingMoves
    );
  };

  const triggerComboMessage = (msg: string) => {
    setComboMessage(msg);
    setTimeout(() => {
      setComboMessage(null);
    }, 1200);
  };

  // Check objective completion
  const checkObjectiveCompletion = (
    level: LevelConfig,
    currentScore: number,
    currentJelly: number,
    currentIngredients: number,
    moves: number
  ) => {
    let objectiveMet = false;

    if (level.objective.type === 'score') {
      objectiveMet = currentScore >= (level.objective.targetScore || 1000);
    } else if (level.objective.type === 'jelly') {
      objectiveMet = currentJelly === 0;
    } else if (level.objective.type === 'ingredients') {
      objectiveMet = currentIngredients === 0;
    } else if (level.objective.type === 'color-collect') {
      objectiveMet = currentScore >= (level.objective.targetScore || 1000);
    }

    if (objectiveMet) {
      sound.playVictory();
      // Calculate star rating
      const [s1, s2, s3] = level.starScores;
      const starsEarned = currentScore >= s3 ? 3 : currentScore >= s2 ? 2 : 1;
      const coinsReward = 50 + starsEarned * 30;

      setIsWin(true);
      setIsGameOver(true);
      setEarnedCoins(coinsReward);

      trackMissionUpdates([{ type: 'win_levels', amount: 1 }]);

      // Save player progress
      setProgress((prev) => {
        const nextUnlocked = Math.max(prev.unlockedLevel, level.id + 1);
        const existingStars = prev.stars[level.id] || 0;
        const newStars = Math.max(existingStars, starsEarned);
        const existingHigh = prev.highScores[level.id] || 0;
        const updatedStarsMap = { ...prev.stars, [level.id]: newStars };

        const curStats = prev.stats || {
          totalJelliesCleared: 0,
          totalScore: 0,
          levelsCompleted: 0,
          totalStars: 0,
          totalSpecialCandies: 0,
          totalSpins: 0,
        };

        const totalStars = (Object.values(updatedStarsMap) as number[]).reduce((a: number, b: number) => a + b, 0);

        return {
          ...prev,
          unlockedLevel: nextUnlocked,
          stars: updatedStarsMap,
          highScores: { ...prev.highScores, [level.id]: Math.max(existingHigh, currentScore) },
          coins: prev.coins + coinsReward,
          stats: {
            ...curStats,
            levelsCompleted: Object.keys(updatedStarsMap).length,
            totalStars,
          },
        };
      });
    } else if (moves <= 0) {
      setIsWin(false);
      setIsGameOver(true);
    }
  };

  // Booster targeting click handler
  const handleApplyBooster = (pos: Position) => {
    if (activeBooster === 'hammer') {
      sound.playHammer();
      const updated = board.map((row) => row.map((cell) => ({ ...cell })));
      applyHammer(updated, pos, currentLevelConfig!.allowedColors);
      setBoard(updated);
      setActiveBooster('none');
      setProgress((prev) => ({
        ...prev,
        boosters: { ...prev.boosters, hammer: Math.max(0, prev.boosters.hammer - 1) },
      }));
      trackMissionUpdates([
        { type: 'use_hammer', amount: 1 },
        { type: 'use_booster', amount: 1 },
      ]);
    }
  };

  // Extra moves booster
  const handleUseExtraMoves = () => {
    if (progress.boosters.extraMoves > 0) {
      setMovesLeft((prev) => prev + 5);
      setProgress((prev) => ({
        ...prev,
        boosters: { ...prev.boosters, extraMoves: Math.max(0, prev.boosters.extraMoves - 1) },
      }));
      trackMissionUpdates([{ type: 'use_booster', amount: 1 }]);
      sound.playCoin();
    }
  };

  // Shuffle booster
  const handleUseShuffle = () => {
    if (!currentLevelConfig) return;
    sound.playSwap();
    const updated = createInitialBoard(currentLevelConfig);
    setBoard(updated);
  };

  // Shop purchases
  const handleBuyBoosterInShop = (type: string, cost: number, amount: number) => {
    setProgress((prev) => {
      if (prev.coins < cost) return prev;
      const newBoosters = { ...prev.boosters };
      if (type === 'hammer') newBoosters.hammer += amount;
      if (type === 'freeSwap') newBoosters.freeSwap += amount;
      if (type === 'extraMoves') newBoosters.extraMoves += amount;
      if (type === 'colorBombStart') newBoosters.colorBombStart += amount;

      return {
        ...prev,
        coins: prev.coins - cost,
        boosters: newBoosters,
      };
    });
  };

  // Daily Login Streak Claim Reward
  const handleClaimDailyStreak = (
    updatedStreakData: DailyStreakData,
    reward: DailyStreakReward
  ) => {
    setProgress((prev) => {
      const newBoosters = { ...prev.boosters };
      if (reward.boosters) {
        if (reward.boosters.hammer) newBoosters.hammer += reward.boosters.hammer;
        if (reward.boosters.freeSwap) newBoosters.freeSwap += reward.boosters.freeSwap;
        if (reward.boosters.colorBombStart)
          newBoosters.colorBombStart += reward.boosters.colorBombStart;
        if (reward.boosters.stripedStart)
          newBoosters.stripedStart += reward.boosters.stripedStart;
        if (reward.boosters.extraMoves)
          newBoosters.extraMoves += reward.boosters.extraMoves;
      }

      return {
        ...prev,
        coins: prev.coins + reward.coins,
        boosters: newBoosters,
        dailyStreak: updatedStreakData,
      };
    });
  };

  const handleSpendCoinsForSpin = (cost: number): boolean => {
    if (progress.coins < cost) return false;
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins - cost,
    }));
    sound.playCoin();
    return true;
  };

  // Daily Spin Claim Reward
  const handleClaimSpinReward = (rewardType: string, amount: number) => {
    setProgress((prev) => {
      const curStats = prev.stats || {
        totalJelliesCleared: 0,
        totalScore: 0,
        levelsCompleted: 0,
        totalStars: 0,
        totalSpecialCandies: 0,
        totalSpins: 0,
      };

      const newBoosters = { ...prev.boosters };
      if (rewardType === 'hammer') newBoosters.hammer += amount;
      if (rewardType === 'freeSwap') newBoosters.freeSwap += amount;
      if (rewardType === 'colorBombStart') newBoosters.colorBombStart += amount;
      if (rewardType === 'stripedStart') newBoosters.stripedStart += amount;
      if (rewardType === 'extraMoves') newBoosters.extraMoves += amount;

      if (rewardType === 'jackpot') {
        newBoosters.hammer += 1;
        newBoosters.freeSwap += 1;
        newBoosters.colorBombStart += 1;
        newBoosters.stripedStart += 1;
        newBoosters.extraMoves += 1;
      }

      const addedCoins =
        rewardType === 'coins' ? amount : rewardType === 'jackpot' ? 500 : 0;

      return {
        ...prev,
        coins: prev.coins + addedCoins,
        boosters: newBoosters,
        lastSpinDate: new Date().toISOString(),
        stats: {
          ...curStats,
          totalSpins: curStats.totalSpins + 1,
        },
      };
    });
  };

  // Claim world reward chest
  const handleClaimWorldChest = (worldName: string, coinsReward: number) => {
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins + coinsReward,
      claimedWorldChests: {
        ...(prev.claimedWorldChests || {}),
        [worldName]: true,
      },
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[#2D1B4D] font-sans text-white select-none flex flex-col justify-between overflow-x-hidden">
      {view === 'MAP' && (
        <LevelMap
          progress={progress}
          onSelectLevel={handleStartLevel}
          onOpenDailySpin={() => setShowDailySpin(true)}
          onOpenDailyStreak={() => setShowDailyStreak(true)}
          onOpenWeeklyChallenges={() => setShowWeeklyChallenges(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAudioSettings={() => setShowAudioSettings(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenLeaderboard={(levelId) => {
            setLeaderboardLevelId(levelId || currentLevelConfig?.id || progress.unlockedLevel);
            setShowLeaderboard(true);
          }}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onOpenMissions={() => setShowMissions(true)}
          onClaimWorldChest={handleClaimWorldChest}
        />
      )}

      {view === 'GAME' && currentLevelConfig && (
        (() => {
          const gameTheme = getWorldThemeByLevelId(currentLevelConfig.id);
          return (
            <div className={`relative flex flex-col min-h-screen justify-between py-2 bg-gradient-to-b ${gameTheme.gameBackground} transition-colors duration-500 overflow-hidden`}>
              {/* Dynamic Region Ambient Floating Particle Effect */}
              <WorldAmbientEffect effectType={gameTheme.gameAmbientEffect} />

              {/* Header Stats & Objectives */}
              <HeaderHUD
                level={currentLevelConfig}
                score={score}
                movesLeft={movesLeft}
                jellyLeft={jellyLeft}
                ingredientsLeft={ingredientsLeft}
                collectedColors={collectedColors}
                onOpenMap={() => setView('MAP')}
                onPause={() => setView('MAP')}
                onOpenAudioSettings={() => setShowAudioSettings(true)}
                onOpenAchievements={() => setShowAchievements(true)}
                onOpenLeaderboard={() => {
                  setLeaderboardLevelId(currentLevelConfig.id);
                  setShowLeaderboard(true);
                }}
                onOpenAnalytics={() => setShowAnalytics(true)}
                onOpenMissions={() => setShowMissions(true)}
                onOpenDailySpin={() => setShowDailySpin(true)}
                onOpenDailyStreak={() => setShowDailyStreak(true)}
                onOpenWeeklyChallenges={() => setShowWeeklyChallenges(true)}
                hasUnclaimed={hasUnclaimedAchievements(progress)}
                hasUnclaimedMissions={hasUnclaimedMissions(progress.dailyMissions)}
                hasFreeSpin={isFreeSpinAvailable(progress.lastSpinDate)}
                hasStreakClaim={getStreakInfo(progress.dailyStreak).canClaimToday}
                hasWeeklyClaim={hasUnclaimedWeeklyChallenges(progress.weeklyChallenges)}
                equippedBadge={
                  progress.weeklyChallenges?.equippedBadgeId
                    ? ALL_PROFILE_BADGES[progress.weeklyChallenges.equippedBadgeId]
                    : null
                }
              />

              {/* Interactive Candy Board */}
              <GameBoard
                board={board}
                activeBooster={activeBooster}
                hint={hint}
                comboMessage={comboMessage}
                levelId={currentLevelConfig.id}
                worldName={currentLevelConfig.worldName}
                onSwap={handleSwap}
                onApplyBooster={handleApplyBooster}
              />

              {/* Bottom Boosters Toolbar */}
              <BoostersPanel
                boosters={progress.boosters}
                activeBooster={activeBooster}
                onSelectBooster={setActiveBooster}
                onUseExtraMoves={handleUseExtraMoves}
                onUseShuffle={handleUseShuffle}
                onBuyBooster={() => setShowShop(true)}
              />
            </div>
          );
        })()
      )}

      {/* Modals */}
      <AudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />

      {showDailySpin && (
        <DailySpin
          lastSpinDate={progress.lastSpinDate}
          coins={progress.coins}
          onClose={() => setShowDailySpin(false)}
          onClaimReward={handleClaimSpinReward}
          onSpendCoinsForSpin={handleSpendCoinsForSpin}
        />
      )}

      {showShop && (
        <ShopModal
          coins={progress.coins}
          onClose={() => setShowShop(false)}
          onBuyBooster={handleBuyBoosterInShop}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          progress={progress}
          onUpdateProgress={setProgress}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          progress={progress}
          defaultLevelId={leaderboardLevelId}
          onSelectLevelToPlay={(lvlId) => {
            setShowLeaderboard(false);
            handleStartLevel(getLevelConfig(lvlId));
          }}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showAnalytics && (
        <PlayerAnalyticsModal
          progress={progress}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showMissions && (
        <DailyMissionsModal
          missionsData={getOrGenerateDailyMissions(progress.dailyMissions)}
          onClaimReward={handleClaimMissionReward}
          onClose={() => setShowMissions(false)}
        />
      )}

      {showDailyStreak && (
        <DailyStreakModal
          streakData={progress.dailyStreak}
          onClose={() => setShowDailyStreak(false)}
          onClaimReward={handleClaimDailyStreak}
        />
      )}

      {showWeeklyChallenges && (
        <WeeklyChallengesModal
          challengesData={getOrGenerateWeeklyChallenges(progress.weeklyChallenges)}
          onClaimChallenge={handleClaimWeeklyChallenge}
          onEquipBadge={handleEquipBadge}
          onClose={() => setShowWeeklyChallenges(false)}
        />
      )}

      {isGameOver && currentLevelConfig && (
        <GameOverModal
          isWin={isWin}
          score={score}
          stars={
            score >= currentLevelConfig.starScores[2]
              ? 3
              : score >= currentLevelConfig.starScores[1]
              ? 2
              : 1
          }
          levelId={currentLevelConfig.id}
          coinsEarned={earnedCoins}
          onNextLevel={() => handleStartLevel(getLevelConfig(currentLevelConfig.id + 1))}
          onRetry={() => handleStartLevel(currentLevelConfig)}
          onOpenMap={() => setView('MAP')}
          onOpenLeaderboard={() => {
            setLeaderboardLevelId(currentLevelConfig.id);
            setShowLeaderboard(true);
          }}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onOpenMissions={() => setShowMissions(true)}
          onOpenDailySpin={() => setShowDailySpin(true)}
          onOpenDailyStreak={() => setShowDailyStreak(true)}
          onOpenWeeklyChallenges={() => setShowWeeklyChallenges(true)}
          onBuyExtraMovesOffer={
            progress.coins >= 100
              ? () => {
                  setProgress((prev) => ({ ...prev, coins: prev.coins - 100 }));
                  setMovesLeft(5);
                  setIsGameOver(false);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
