export type Player = 'X' | 'O';
export type Board = (Player | null)[];

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createBoard(): Board {
  return Array<Player | null>(9).fill(null);
}

export function getResult(board: Board): Player | 'draw' | null {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(square => square !== null) ? 'draw' : null;
}

export function getCurrentPlayer(board: Board): Player {
  return board.filter(square => square !== null).length % 2 === 0 ? 'X' : 'O';
}

// Return the same board when a move is not allowed.
export function playMove(board: Board, index: number): Board {
  if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] !== null || getResult(board)) {
    return board;
  }
  const next = [...board];
  next[index] = getCurrentPlayer(board);
  return next;
}

// O wins first, blocks X second, otherwise uses the first empty square.
export function chooseComputerMove(board: Board): number | null {
  if (getResult(board) !== null || getCurrentPlayer(board) !== 'O') return null;
  const emptySquares = board.flatMap((square, index) => square === null ? [index] : []);
  for (const player of ['O', 'X'] as const) {
    for (const index of emptySquares) {
      const candidate = [...board];
      candidate[index] = player;
      if (getResult(candidate) === player) return index;
    }
  }
  return emptySquares[0] ?? null;
}
