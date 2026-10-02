import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalMatch } from './matches';
import { getCurrentPlayer, getResult } from '../games/ticTacToe';

export const MATCH_STORAGE_KEY = 'gameportal.local-matches.v1';

export function decodeMatches(raw: string | null): LocalMatch[] {
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.matches)) {
    throw new Error('Unsupported match data');
  }
  const ids = new Set<string>();
  for (const match of data.matches) {
    if (!match || typeof match.id !== 'string' || !/^[1-9]\d*$/.test(match.id)
      || !Number.isSafeInteger(Number(match.id)) || Number(match.id) >= Number.MAX_SAFE_INTEGER
      || ids.has(match.id) || match.gameName !== 'Tic-Tac-Toe'
      || !Array.isArray(match.board) || match.board.length !== 9
      || !match.board.every((cell: unknown) => cell === null || cell === 'X' || cell === 'O')) {
      throw new Error('Invalid match data');
    }
    const result = getResult(match.board);
    const xCount = match.board.filter((cell: unknown) => cell === 'X').length;
    const oCount = match.board.filter((cell: unknown) => cell === 'O').length;
    if ((xCount !== oCount && xCount !== oCount + 1)
      || (result === 'X' && xCount !== oCount + 1)
      || (result === 'O' && xCount !== oCount)
      || match.result !== result
      || match.status !== (result === null ? 'active' : 'finished')
      || match.currentTurn !== (result === null ? getCurrentPlayer(match.board) : null)) {
      throw new Error('Inconsistent match data');
    }
    ids.add(match.id);
  }
  return data.matches;
}

export function nextMatchId(matches: LocalMatch[]): number {
  return matches.reduce((largest, match) => Math.max(largest, Number(match.id)), 0) + 1;
}

type Storage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function createMatchStorage(storage: Storage) {
  let pending: Promise<void> = Promise.resolve();
  return {
    async load(): Promise<LocalMatch[]> {
      return decodeMatches(await storage.getItem(MATCH_STORAGE_KEY));
    },
    save(matches: LocalMatch[]): Promise<void> {
      // Capture this snapshot now; queue writes so the newest snapshot is saved last.
      const snapshot = JSON.stringify({ version: 1, matches });
      const write = pending.then(() => storage.setItem(MATCH_STORAGE_KEY, snapshot));
      pending = write.catch(() => {});
      return write;
    },
  };
}

export const matchStorage = createMatchStorage(AsyncStorage);
