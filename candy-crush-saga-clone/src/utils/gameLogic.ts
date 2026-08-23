import {
  BoardCell,
  Candy,
  CandyColor,
  LevelConfig,
  Position,
  SpecialCandyType,
  BlockerType,
} from '../types';

let nextCandyId = 1;

export function generateRandomCandy(
  allowedColors: CandyColor[],
  forceType: SpecialCandyType = 'none'
): Candy {
  const randomColor = allowedColors[Math.floor(Math.random() * allowedColors.length)];
  return {
    id: `candy-${nextCandyId++}-${Math.random().toString(36).substring(2, 7)}`,
    color: randomColor,
    type: forceType,
    isMatched: false,
    isNew: true,
  };
}

export function generateIngredient(): Candy {
  const isCherry = Math.random() > 0.5;
  return {
    id: `ingredient-${nextCandyId++}-${Math.random().toString(36).substring(2, 7)}`,
    color: 'red', // arbitrary fallback
    type: 'none',
    isIngredient: true,
    ingredientType: isCherry ? 'cherry' : 'hazelnut',
    isMatched: false,
  };
}

export function createInitialBoard(level: LevelConfig): BoardCell[][] {
  const rows = level.rows;
  const cols = level.cols;
  let board: BoardCell[][] = [];

  let attempts = 0;
  let validBoardCreated = false;

  while (!validBoardCreated && attempts < 100) {
    attempts++;
    board = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        let blocker: BlockerType = 'none';

        if (level.initialJellyGrid && level.initialJellyGrid[r] && level.initialJellyGrid[r][c]) {
          blocker = 'jelly-1';
        } else if (level.initialIceGrid && level.initialIceGrid[r] && level.initialIceGrid[r][c]) {
          blocker = 'ice-1';
        } else if (
          level.initialChocolateGrid &&
          level.initialChocolateGrid[r] &&
          level.initialChocolateGrid[r][c]
        ) {
          blocker = 'chocolate';
        }

        return {
          row: r,
          col: c,
          candy: generateRandomCandy(level.allowedColors),
          blocker,
          isExitRow: r === rows - 1,
        };
      })
    );

    // If initial board has matches, re-roll offending candies so player starts clean
    let matches = findMatches(board);
    while (matches.length > 0) {
      for (const m of matches) {
        for (const pos of m.positions) {
          board[pos.row][pos.col].candy = generateRandomCandy(level.allowedColors);
        }
      }
      matches = findMatches(board);
    }

    // Place initial ingredients if needed
    if (level.ingredientsToDrop && level.ingredientsToDrop > 0) {
      const ingredientCols = [1, Math.floor(cols / 2), cols - 2];
      for (let i = 0; i < Math.min(level.ingredientsToDrop, ingredientCols.length); i++) {
        const c = ingredientCols[i];
        if (board[0] && board[0][c]) {
          board[0][c].candy = generateIngredient();
        }
      }
    }

    if (hasPossibleMoves(board, level.allowedColors)) {
      validBoardCreated = true;
    }
  }

  return board;
}

export interface MatchResult {
  positions: Position[];
  color: CandyColor;
  createdSpecialType: SpecialCandyType;
  creationPos?: Position;
}

export function findMatches(board: BoardCell[][]): MatchResult[] {
  const rows = board.length;
  const cols = board[0].length;
  const matchResults: MatchResult[] = [];

  // Track matched horizontal & vertical spans
  const hMatched: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const vMatched: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  // Horizontal match check
  for (let r = 0; r < rows; r++) {
    let matchLen = 1;
    for (let c = 0; c < cols; c++) {
      const current = board[r][c].candy;
      const next = c < cols - 1 ? board[r][c + 1].candy : null;

      if (
        current &&
        next &&
        !current.isIngredient &&
        !next.isIngredient &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          const positions: Position[] = [];
          for (let k = c - matchLen + 1; k <= c; k++) {
            hMatched[r][k] = true;
            positions.push({ row: r, col: k });
          }
          matchResults.push({
            positions,
            color: board[r][c].candy!.color,
            createdSpecialType: matchLen >= 5 ? 'color-bomb' : matchLen === 4 ? 'striped-h' : 'none',
          });
        }
        matchLen = 1;
      }
    }
  }

  // Vertical match check
  for (let c = 0; c < cols; c++) {
    let matchLen = 1;
    for (let r = 0; r < rows; r++) {
      const current = board[r][c].candy;
      const next = r < rows - 1 ? board[r + 1][c].candy : null;

      if (
        current &&
        next &&
        !current.isIngredient &&
        !next.isIngredient &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          const positions: Position[] = [];
          for (let k = r - matchLen + 1; k <= r; k++) {
            vMatched[k][c] = true;
            positions.push({ row: r, col: c });
          }
          matchResults.push({
            positions,
            color: board[r][c].candy!.color,
            createdSpecialType: matchLen >= 5 ? 'color-bomb' : matchLen === 4 ? 'striped-v' : 'none',
          });
        }
        matchLen = 1;
      }
    }
  }

  // Check for T or L shapes (where both hMatched and vMatched intersect!) -> Wrapped Candy
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (hMatched[r][c] && vMatched[r][c]) {
        // Find which matchResult includes this position and upgrade it to 'wrapped'
        const res = matchResults.find((m) =>
          m.positions.some((p) => p.row === r && p.col === c)
        );
        if (res && res.createdSpecialType !== 'color-bomb') {
          res.createdSpecialType = 'wrapped';
          res.creationPos = { row: r, col: c };
        }
      }
    }
  }

  return matchResults;
}

export function isValidSwap(board: BoardCell[][], posA: Position, posB: Position): boolean {
  // Must be adjacent
  const dRow = Math.abs(posA.row - posB.row);
  const dCol = Math.abs(posA.col - posB.col);
  if (dRow + dCol !== 1) return false;

  const candyA = board[posA.row][posA.col].candy;
  const candyB = board[posB.row][posB.col].candy;

  if (!candyA || !candyB) return false;

  // Color Bomb swapped with anything is always valid!
  if (candyA.type === 'color-bomb' || candyB.type === 'color-bomb') return true;

  // Two special candies swapped together is always valid!
  if (candyA.type !== 'none' && candyB.type !== 'none') return true;

  // Standard swap simulation
  const tempBoard = copyBoard(board);
  tempBoard[posA.row][posA.col].candy = candyB;
  tempBoard[posB.row][posB.col].candy = candyA;

  const matches = findMatches(tempBoard);
  return matches.length > 0;
}

export function copyBoard(board: BoardCell[][]): BoardCell[][] {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      candy: cell.candy ? { ...cell.candy } : null,
    }))
  );
}

export function hasPossibleMoves(board: BoardCell[][], allowedColors: CandyColor[]): boolean {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Check swap with right neighbour
      if (c < cols - 1) {
        if (isValidSwap(board, { row: r, col: c }, { row: r, col: c + 1 })) {
          return true;
        }
      }
      // Check swap with bottom neighbour
      if (r < rows - 1) {
        if (isValidSwap(board, { row: r, col: c }, { row: r + 1, col: c })) {
          return true;
        }
      }
    }
  }

  return false;
}

export interface CascadeStep {
  clearedPositions: Position[];
  createdSpecials: { pos: Position; candy: Candy }[];
  scoreGained: number;
  jellyCleared: number;
  ingredientsCollected: number;
  comboLevel: number;
  specialComboName?: string;
}

export function executeSwapAndCascade(
  board: BoardCell[][],
  posA: Position,
  posB: Position,
  allowedColors: CandyColor[]
): { steps: CascadeStep[]; updatedBoard: BoardCell[][] } {
  const workingBoard = copyBoard(board);

  const candyA = workingBoard[posA.row][posA.col].candy!;
  const candyB = workingBoard[posB.row][posB.col].candy!;

  // Execute swap
  workingBoard[posA.row][posA.col].candy = candyB;
  workingBoard[posB.row][posB.col].candy = candyA;

  const steps: CascadeStep[] = [];
  let comboCount = 1;

  // Check if special combination was triggered
  if (candyA.type === 'color-bomb' || candyB.type === 'color-bomb') {
    const specialStep = handleColorBombSwap(workingBoard, posA, posB, candyA, candyB, allowedColors);
    if (specialStep) {
      steps.push(specialStep);
    }
  } else if (candyA.type !== 'none' && candyB.type !== 'none') {
    const specialStep = handleSpecialComboSwap(workingBoard, posA, posB, candyA, candyB);
    if (specialStep) {
      steps.push(specialStep);
    }
  }

  // Standard match cascade loop
  let matches = findMatches(workingBoard);

  while (matches.length > 0) {
    const matchedPositionsSet = new Set<string>();
    const createdSpecials: { pos: Position; candy: Candy }[] = [];
    let stepScore = 0;
    let stepJellyCleared = 0;
    let stepIngredientsCollected = 0;

    for (const match of matches) {
      stepScore += match.positions.length * 60 * comboCount;

      // Determine where the special candy should spawn if created
      let targetPos = match.creationPos;
      if (!targetPos) {
        // Default to the position involved in swap, or center of match
        targetPos =
          match.positions.find((p) => (p.row === posA.row && p.col === posA.col) || (p.row === posB.row && p.col === posB.col)) ||
          match.positions[Math.floor(match.positions.length / 2)];
      }

      for (const pos of match.positions) {
        matchedPositionsSet.add(`${pos.row},${pos.col}`);
      }

      // If this match creates a special candy
      if (match.createdSpecialType !== 'none' && targetPos) {
        const specialCandy = generateRandomCandy(allowedColors, match.createdSpecialType);
        specialCandy.color = match.color;
        createdSpecials.push({ pos: targetPos, candy: specialCandy });
      }
    }

    // Convert matchedSet to positions array
    const clearedPositions: Position[] = Array.from(matchedPositionsSet).map((str) => {
      const [r, c] = str.split(',').map(Number);
      return { row: r, col: c };
    });

    // Expand cleared positions if special candies were inside match!
    const expandedPositions = expandSpecialActivations(workingBoard, clearedPositions);

    // Clear candies and update blockers/jelly
    for (const pos of expandedPositions) {
      const cell = workingBoard[pos.row][pos.col];

      // If cell has jelly/ice
      if (cell.blocker === 'jelly-1') {
        cell.blocker = 'none';
        stepJellyCleared++;
        stepScore += 100;
      } else if (cell.blocker === 'ice-1') {
        cell.blocker = 'none';
        stepScore += 100;
      } else if (cell.blocker === 'chocolate') {
        cell.blocker = 'none';
        stepScore += 150;
      }

      // Clear candy
      cell.candy = null;
    }

    // Re-insert newly created special candies into board
    for (const spec of createdSpecials) {
      workingBoard[spec.pos.row][spec.pos.col].candy = spec.candy;
    }

    // Apply Gravity (Candies drop down)
    applyGravityAndRefill(workingBoard, allowedColors);

    // Check for ingredients reaching bottom row
    for (let c = 0; c < workingBoard[0].length; c++) {
      const bottomCell = workingBoard[workingBoard.length - 1][c];
      if (bottomCell.candy && bottomCell.candy.isIngredient) {
        stepIngredientsCollected++;
        bottomCell.candy = null;
        applyGravityAndRefill(workingBoard, allowedColors);
      }
    }

    steps.push({
      clearedPositions: expandedPositions,
      createdSpecials,
      scoreGained: stepScore,
      jellyCleared: stepJellyCleared,
      ingredientsCollected: stepIngredientsCollected,
      comboLevel: comboCount,
    });

    comboCount++;
    matches = findMatches(workingBoard);
  }

  // Ensure board has valid moves, otherwise reshuffle
  if (!hasPossibleMoves(workingBoard, allowedColors)) {
    reshuffleBoard(workingBoard, allowedColors);
  }

  return { steps, updatedBoard: workingBoard };
}

function handleColorBombSwap(
  board: BoardCell[][],
  posA: Position,
  posB: Position,
  candyA: Candy,
  candyB: Candy,
  allowedColors: CandyColor[]
): CascadeStep | null {
  const colorBombPos = candyA.type === 'color-bomb' ? posA : posB;
  const otherCandy = candyA.type === 'color-bomb' ? candyB : candyA;

  const clearedPositions: Position[] = [];
  let scoreGained = 0;
  let comboName = 'Color Bomb!';

  if (otherCandy.type === 'color-bomb') {
    // Color Bomb + Color Bomb -> CLEARS ENTIRE BOARD!
    comboName = 'DISCO PARTY! CLEAR ALL!';
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        clearedPositions.push({ row: r, col: c });
        board[r][c].candy = null;
      }
    }
    scoreGained = 3000;
  } else {
    // Clear all candies of targeted color
    const targetColor = otherCandy.color;
    comboName = `SUPER COLOR BOMB (${targetColor.toUpperCase()})!`;

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        const cell = board[r][c];
        if (cell.candy && cell.candy.color === targetColor) {
          clearedPositions.push({ row: r, col: c });
          cell.candy = null;
          scoreGained += 100;
        }
      }
    }
    // Also clear color bomb itself
    clearedPositions.push(colorBombPos);
    board[colorBombPos.row][colorBombPos.col].candy = null;
  }

  applyGravityAndRefill(board, allowedColors);

  return {
    clearedPositions,
    createdSpecials: [],
    scoreGained,
    jellyCleared: 0,
    ingredientsCollected: 0,
    comboLevel: 1,
    specialComboName: comboName,
  };
}

function handleSpecialComboSwap(
  board: BoardCell[][],
  posA: Position,
  posB: Position,
  candyA: Candy,
  candyB: Candy
): CascadeStep | null {
  const clearedPositions: Position[] = [];
  let comboName = 'Special Combo!';

  if (
    (candyA.type.startsWith('striped') && candyB.type.startsWith('striped'))
  ) {
    // Striped + Striped -> Clears cross row & column
    comboName = 'SUPER CROSS BLAST!';
    for (let c = 0; c < board[0].length; c++) clearedPositions.push({ row: posA.row, col: c });
    for (let r = 0; r < board.length; r++) clearedPositions.push({ row: r, col: posA.col });
  } else if (
    (candyA.type.startsWith('striped') && candyB.type === 'wrapped') ||
    (candyA.type === 'wrapped' && candyB.type.startsWith('striped'))
  ) {
    // Striped + Wrapped -> Giant 3-row, 3-col cross blast!
    comboName = 'MEGA STRIPED WRAPPER!';
    const rows = [posA.row - 1, posA.row, posA.row + 1];
    const cols = [posA.col - 1, posA.col, posA.col + 1];
    for (const r of rows) {
      if (r >= 0 && r < board.length) {
        for (let c = 0; c < board[0].length; c++) clearedPositions.push({ row: r, col: c });
      }
    }
    for (const c of cols) {
      if (c >= 0 && c < board[0].length) {
        for (let r = 0; r < board.length; r++) clearedPositions.push({ row: r, col: c });
      }
    }
  } else if (candyA.type === 'wrapped' && candyB.type === 'wrapped') {
    // Wrapped + Wrapped -> Giant 5x5 explosion!
    comboName = 'GIGANTIC CANDY EXPLOSION!';
    for (let r = posA.row - 2; r <= posA.row + 2; r++) {
      for (let c = posA.col - 2; c <= posA.col + 2; c++) {
        if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
          clearedPositions.push({ row: r, col: c });
        }
      }
    }
  }

  for (const pos of clearedPositions) {
    board[pos.row][pos.col].candy = null;
  }

  return {
    clearedPositions,
    createdSpecials: [],
    scoreGained: clearedPositions.length * 80,
    jellyCleared: 0,
    ingredientsCollected: 0,
    comboLevel: 1,
    specialComboName: comboName,
  };
}

function expandSpecialActivations(board: BoardCell[][], initialCleared: Position[]): Position[] {
  const resultPositionsSet = new Set<string>();
  const queue: Position[] = [...initialCleared];

  while (queue.length > 0) {
    const pos = queue.shift()!;
    const key = `${pos.row},${pos.col}`;
    if (resultPositionsSet.has(key)) continue;

    resultPositionsSet.add(key);
    const candy = board[pos.row][pos.col].candy;

    if (candy) {
      if (candy.type === 'striped-h') {
        for (let c = 0; c < board[0].length; c++) {
          queue.push({ row: pos.row, col: c });
        }
      } else if (candy.type === 'striped-v') {
        for (let r = 0; r < board.length; r++) {
          queue.push({ row: r, col: pos.col });
        }
      } else if (candy.type === 'wrapped') {
        for (let r = pos.row - 1; r <= pos.row + 1; r++) {
          for (let c = pos.col - 1; c <= pos.col + 1; c++) {
            if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
              queue.push({ row: r, col: c });
            }
          }
        }
      }
    }
  }

  return Array.from(resultPositionsSet).map((key) => {
    const [r, c] = key.split(',').map(Number);
    return { row: r, col: c };
  });
}

export function applyGravityAndRefill(board: BoardCell[][], allowedColors: CandyColor[]) {
  const rows = board.length;
  const cols = board[0].length;

  for (let c = 0; c < cols; c++) {
    let emptyRow = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c].candy !== null) {
        if (r !== emptyRow) {
          board[emptyRow][c].candy = board[r][c].candy;
          board[r][c].candy = null;
        }
        emptyRow--;
      }
    }

    // Fill remaining top empty rows with new candies
    for (let r = emptyRow; r >= 0; r--) {
      board[r][c].candy = generateRandomCandy(allowedColors);
    }
  }
}

export function reshuffleBoard(board: BoardCell[][], allowedColors: CandyColor[]) {
  const rows = board.length;
  const cols = board[0].length;
  const candies: Candy[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].candy) {
        candies.push(board[r][c].candy!);
      }
    }
  }

  let valid = false;
  let attempts = 0;

  while (!valid && attempts < 50) {
    attempts++;
    // Fisher-Yates shuffle
    for (let i = candies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candies[i], candies[j]] = [candies[j], candies[i]];
    }

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].candy) {
          board[r][c].candy = candies[idx++];
        }
      }
    }

    // Check if initial reshuffle has no instant matches AND has possible moves
    const matches = findMatches(board);
    if (matches.length === 0 && hasPossibleMoves(board, allowedColors)) {
      valid = true;
    }
  }
}

// Power-up / Booster helpers
export function applyHammer(board: BoardCell[][], pos: Position, allowedColors: CandyColor[]) {
  const cell = board[pos.row][pos.col];
  cell.candy = null;
  if (cell.blocker === 'jelly-1' || cell.blocker === 'ice-1' || cell.blocker === 'chocolate') {
    cell.blocker = 'none';
  }
  applyGravityAndRefill(board, allowedColors);
}

export function findHintMove(board: BoardCell[][]): { posA: Position; posB: Position } | null {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1 && isValidSwap(board, { row: r, col: c }, { row: r, col: c + 1 })) {
        return { posA: { row: r, col: c }, posB: { row: r, col: c + 1 } };
      }
      if (r < rows - 1 && isValidSwap(board, { row: r, col: c }, { row: r + 1, col: c })) {
        return { posA: { row: r, col: c }, posB: { row: r + 1, col: c } };
      }
    }
  }

  return null;
}
