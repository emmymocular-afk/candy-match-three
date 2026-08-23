import React, { useState, useEffect } from 'react';
import { BoardCell, Position, ActiveBooster } from '../types';
import { CandyTile } from './CandyTile';
import { sound } from '../utils/sound';
import { getWorldThemeByLevelId, getWorldThemeByName } from '../utils/worldThemes';

interface GameBoardProps {
  board: BoardCell[][];
  activeBooster: ActiveBooster;
  hint: { posA: Position; posB: Position } | null;
  comboMessage: string | null;
  levelId?: number;
  worldName?: string;
  onSwap: (posA: Position, posB: Position) => void;
  onApplyBooster: (pos: Position) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  activeBooster,
  hint,
  comboMessage,
  levelId,
  worldName,
  onSwap,
  onApplyBooster,
}) => {
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [draggedPos, setDraggedPos] = useState<Position | null>(null);

  const theme = levelId
    ? getWorldThemeByLevelId(levelId)
    : worldName
    ? getWorldThemeByName(worldName)
    : getWorldThemeByLevelId(1);

  const rows = board.length;
  const cols = board[0].length;

  const handleTileClick = (pos: Position) => {
    // If an active booster is selected (e.g., Hammer), apply it
    if (activeBooster !== 'none') {
      onApplyBooster(pos);
      return;
    }

    if (!selectedPos) {
      setSelectedPos(pos);
      sound.playPop();
      return;
    }

    // Second click - check if adjacent
    const dRow = Math.abs(selectedPos.row - pos.row);
    const dCol = Math.abs(selectedPos.col - pos.col);

    if (dRow + dCol === 1) {
      onSwap(selectedPos, pos);
      setSelectedPos(null);
    } else {
      // Re-select new tile
      setSelectedPos(pos);
      sound.playPop();
    }
  };

  const handleDragStart = (e: React.DragEvent, pos: Position) => {
    setDraggedPos(pos);
  };

  const handleDrop = (e: React.DragEvent, targetPos: Position) => {
    e.preventDefault();
    if (!draggedPos) return;

    const dRow = Math.abs(draggedPos.row - targetPos.row);
    const dCol = Math.abs(draggedPos.col - targetPos.col);

    if (dRow + dCol === 1) {
      onSwap(draggedPos, targetPos);
    }
    setDraggedPos(null);
  };

  return (
    <div className={`relative w-full max-w-md mx-auto p-3.5 backdrop-blur-md rounded-[28px] my-auto flex flex-col items-center transition-all duration-500 ${theme.boardWrapperStyle}`}>
      {/* Booster overlay message if active */}
      {activeBooster === 'hammer' && (
        <div className="absolute -top-4 bg-pink-600 text-white font-extrabold text-xs px-4 py-1 rounded-full shadow-lg border border-pink-300 animate-bounce z-30">
          🔨 Tap any candy or blocker to smash!
        </div>
      )}

      {activeBooster === 'freeSwap' && (
        <div className="absolute -top-4 bg-cyan-600 text-white font-extrabold text-xs px-4 py-1 rounded-full shadow-lg border border-cyan-300 animate-bounce z-30">
          ↔️ Tap any two adjacent candies to free swap!
        </div>
      )}

      {/* Combo Popup Text Overlay */}
      {comboMessage && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
          <div className="text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 drop-shadow-[0_4px_12px_rgba(244,63,94,0.9)] animate-bounce transform scale-125">
            {comboMessage}
          </div>
        </div>
      )}

      {/* Dynamic Grid Layout */}
      <div
        className={`grid gap-1.5 w-full aspect-square p-2 rounded-2xl shadow-inner transition-colors duration-500 ${theme.gridContainerStyle}`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const isHint =
              (hint?.posA.row === r && hint?.posA.col === c) ||
              (hint?.posB.row === r && hint?.posB.col === c);

            return (
              <CandyTile
                key={`${r}-${c}-${cell.candy?.id || 'empty'}`}
                candy={cell.candy}
                blocker={cell.blocker}
                isSelected={isSelected}
                isHint={isHint}
                cellBaseBg={theme.cellBaseBg}
                onClick={() => handleTileClick({ row: r, col: c })}
                onDragStart={(e) => handleDragStart(e, { row: r, col: c })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, { row: r, col: c })}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
