# GamePortal — fifth demo

React Native, Expo SDK 54, and TypeScript. Discover games, choose a mode, and play Tic-Tac-Toe locally or against a simple computer opponent.

## Launch

From this folder, with Node.js 20.19.4 or newer:

    npm install
    npm run web

If the existing Expo server is running, refresh the browser to load the changes.

For mobile, run npm start and scan the QR code using Expo Go compatible with SDK 54.
An iOS simulator requires macOS.

## Checks

    npm run typecheck
    npm test
    npx expo install --check
    npx expo export --platform web

## Code

- App.tsx: shared safe-area layout and status bar.
- portal/Portal.tsx: navigation, persisted local match collection, and screen switching.
- portal/matches.ts: match records and lifecycle updates using the existing rules.
- screens/DiscoverScreen.tsx: original Discover screen and search.
- screens/MyMatchesScreen.tsx: Active and Finished sections.
- components/ModeSelection.tsx: local play, computer play, and disabled online play.
- games/TicTacToeGame.tsx: board display, local board state, reset, and return.
- games/ticTacToe.ts: pure functions for turns, moves, wins, draws, and computer move selection.
- games/ticTacToe.test.cjs: rules checks using Node's built-in test runner.

No backend, authentication, online play, notifications, database, or state management library.

## Browser walkthrough

Number squares 1–9 from left to right, top to bottom.

1. Search for Tic-Tac-Toe; unknown searches show no results. Clear search to restore all cards.
2. Choose Mode: Local 2 Players works; Vs Computer is enabled; Online Multiplayer is disabled and marked Coming soon. Back to Games closes the modal.
3. Start local play: nine empty squares and Player X's turn. Click any square; it becomes X and the turn changes to O. Click it again; nothing changes.
4. X win: click 1, 4, 2, 5, 3. Expect Player X wins! Empty squares must reject further moves.
5. Play Again: empty board, Player X starts.
6. O win: click 1, 4, 2, 5, 9, 6. Expect Player O wins! Further moves must be blocked.
7. Play Again, then draw: click 1, 2, 3, 5, 4, 6, 8, 7, 9. Expect It's a draw!
8. Back to Games returns to Discover with the search preserved. Starting another local game gives a fresh board.
9. Resize to a narrow mobile width and a wide desktop width. Cards wrap and the board fits its container. Test keyboard Tab and Enter/Space on buttons.

## Validation

TypeScript check and all fifteen rules, computer strategy, and match lifecycle tests passed. The previous Expo dependency check reported versions up to date,
with an offline validation warning. Web export passed; Metro emitted only a harmless NO_COLOR / FORCE_COLOR environment warning.


## Vs Computer browser checks

Number squares 1–9 from left to right, top to bottom. Start a fresh game for each sequence.
Click only the listed human squares, waiting for the computer response after each move.

- Choose Vs Computer: empty board, Your turn, human X, computer O.
- Click square 1: thinking status briefly appears, clicks are blocked, O takes square 2.
- Blocking: play 1, 5; O should take 9 to block your diagonal.
- Human win: play 1, 3, 5, 9. Expect You win!
- Computer win: play 1, 3, 7, 6. Expect Computer wins! (O takes 2, 4, 5, 8.)
- Draw: play 1, 3, 5, 6, 8. Expect It's a draw!
- After any result, board clicks do nothing. Play Again resets to X and Your turn.
- Click Play Again during the thinking pause: the board stays empty without a delayed O.
- Click Back to Games during the thinking pause, then reopen a game: no delayed move carries over.
- Recheck Local 2 Players using the sequences above: turns, results, and resets behave as before.
- Recheck Discover search and narrow mobile layout.

The computer chooses its own immediate win, then blocks an immediate X win, then takes
the first empty square. It is intentionally simple and can lose to a fork.
No packages were added. TypeScript, ten tests, and web export passed in this iteration.

## My Matches walkthrough

Local match records are saved using AsyncStorage and restored on reload.
Only Local 2 Players games appear here. Computer mode remains independent.

Number squares 1–9 left to right, top to bottom.

1. Open My Matches on a fresh app. Expect No active matches yet and No finished matches yet.
2. Open Discover > Choose Mode > Local 2 Players. Note the match id. X starts.
3. Click square 1 (X), then square 4 (O). Expect Player X's turn.
4. Click Back to Games, then My Matches. Find the same id under ACTIVE, with Player X's turn.
5. Open that match. X remains in square 1, O in square 4. Click 2 (X), 5 (O), then 3 (X).
6. Expect Player X wins! Click Back to Games. The same match is now under FINISHED, labeled X won.
7. Open the finished match. The final board remains intact. Click empty square 9; it must stay empty.
8. Click Play Again. Expect a new id, an empty board, and Player X's turn.
9. Return to My Matches. The previous id is still Finished; the new id is Active.
10. Start another local game from Discover; confirm both active records remain independent.
11. Recheck Vs Computer, search, and narrow-screen layout using the checks above.

Validation for this iteration: all 15 tests, TypeScript, and Expo web export passed.
Export emitted only the harmless NO_COLOR / FORCE_COLOR environment warning.
Local persistence uses @react-native-async-storage/async-storage 2.2.0.

## Persistence reload walkthrough

Use the same browser and web address (including port) throughout. Browser storage is
specific to that address. Computer games are not saved.

1. Discover > Choose Mode > Local 2 Players. Note the match ID.
2. Click square 1 (X), then square 4 (O), numbering 1–9 left to right, top to bottom.
3. Back to Games > My Matches. Wait for Matches saved on this device, then reload the browser.
4. Open My Matches. The same ID appears once under ACTIVE, with Player X's turn.
5. Open it. X is still in square 1, O in square 4; other squares are empty.
6. Click square 2 (X), square 5 (O), then square 3 (X). Expect Player X wins!
7. Back to Games > My Matches. Wait for the saved message, then reload again.
8. Open My Matches. The same ID is under FINISHED, labeled X won.
9. Open it and click empty square 9. It stays empty; the final board is locked.
10. Play Again creates a new ID and empty board. Return to My Matches: the previous finished
    record remains and the new record is Active. Starting a new local match from Discover
    also uses a new ID.

Storage is versioned and contains each match's ID, board, status, turn, result, and game name.
Records load before local play is available. New IDs start above the highest restored ID.
Writes are queued in order. Failed reads do not overwrite saved data; failed writes display
a message and retry on the next local match change. No game rules were changed.

Added files: portal/matchStorage.ts, portal/useLocalMatches.ts, portal/matchStorage.test.cjs.
Updated: portal/Portal.tsx, screens/MyMatchesScreen.tsx, package.json, package-lock.json, README.md.

Current validation: all 22 tests passed, TypeScript passed, Expo web export passed.
Export emitted only the harmless NO_COLOR / FORCE_COLOR environment warning.
