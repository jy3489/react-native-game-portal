const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Compile only the pure rules for Node; no test framework dependency is needed.
const source = fs.readFileSync(__dirname + '/ticTacToe.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { createBoard, getResult, getCurrentPlayer, playMove, chooseComputerMove } = context.exports;
const play = moves => moves.reduce((board, index) => playMove(board, index), createBoard());

test('X starts, turns alternate, and occupied squares reject moves', () => {
  const empty = createBoard();
  assert.equal(getCurrentPlayer(empty), 'X');
  const first = playMove(empty, 0);
  assert.equal(first[0], 'X');
  assert.equal(empty[0], null);
  assert.equal(getCurrentPlayer(first), 'O');
  assert.equal(playMove(first, 0), first);
  const second = playMove(first, 1);
  assert.equal(second[1], 'O');
  assert.equal(getCurrentPlayer(second), 'X');
});

test('all eight winning lines work for either player', () => {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const player of ['X', 'O']) {
    for (const line of lines) {
      const board = createBoard();
      for (const index of line) board[index] = player;
      assert.equal(getResult(board), player);
    }
  }
});

test('legal X and O wins stop further moves', () => {
  for (const [moves, winner] of [
    [[0,3,1,4,2], 'X'],
    [[0,3,1,4,8,5], 'O'],
  ]) {
    const board = play(moves);
    assert.equal(getResult(board), winner);
    for (let index = 0; index < 9; index++) assert.equal(playMove(board, index), board);
  }
});

test('draw, in-progress result, and a fresh board', () => {
  assert.equal(getResult(play([0,1,2])), null);
  const draw = play([0,1,2,4,3,5,7,6,8]);
  assert.equal(getResult(draw), 'draw');
  assert.equal(playMove(draw, 0), draw);
  const reset = createBoard();
  assert.equal(reset.length, 9);
  assert.ok(reset.every(square => square === null));
  assert.equal(getResult(reset), null);
  assert.equal(getCurrentPlayer(reset), 'X');
});

test('out-of-range moves are rejected', () => {
  const board = createBoard();
  for (const index of [-1, 9, 0.5]) assert.equal(playMove(board, index), board);
});

test('computer takes a win before blocking the human', () => {
  const board = ['X', 'X', null, 'O', 'O', null, 'X', null, null];
  assert.equal(chooseComputerMove(board), 5);
  assert.equal(getResult(playMove(board, chooseComputerMove(board))), 'O');
});

test('computer blocks an immediate human win', () => {
  const board = ['X', 'X', null, 'O', null, null, null, null, null];
  const original = [...board];
  assert.equal(chooseComputerMove(board), 2);
  assert.deepEqual(board, original);
});

test('computer uses a legal empty square when no win or block exists', () => {
  const board = play([0]);
  assert.equal(chooseComputerMove(board), 1);
  const next = playMove(board, chooseComputerMove(board));
  assert.equal(next[0], 'X');
  assert.equal(next[1], 'O');
  assert.equal(getCurrentPlayer(next), 'X');
});

test('computer does not move on a human turn or after a result', () => {
  assert.equal(chooseComputerMove(createBoard()), null);
  assert.equal(chooseComputerMove(play([0,3,1,4,2])), null);
  assert.equal(chooseComputerMove(play([0,3,1,4,8,5])), null);
  assert.equal(chooseComputerMove(play([0,1,2,4,3,5,7,6,8])), null);
});

test('computer always selects a legal move in every reachable unfinished O turn', () => {
  function visit(board) {
    if (getResult(board) !== null) {
      assert.equal(chooseComputerMove(board), null);
      return;
    }
    if (getCurrentPlayer(board) === 'O') {
      const index = chooseComputerMove(board);
      assert.ok(Number.isInteger(index) && index >= 0 && index < 9);
      assert.equal(board[index], null);
      visit(playMove(board, index));
    } else {
      for (let index = 0; index < 9; index++) {
        if (board[index] === null) visit(playMove(board, index));
      }
    }
  }
  visit(createBoard());
});
