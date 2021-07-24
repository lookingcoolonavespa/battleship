import { expect, it } from '@jest/globals';
import gameLoop from '../gameLoop.js';
import { Player, CPU } from '../player.js';
import Gameboard from '../gameboard.js';

const newGame = gameLoop.startNewGame('cpu');
const { playerOne, playerTwo } = newGame;

it('startNewGame() creates one human player and one computer player', () => {
  const humanPlayer = Player();
  const cpuPlayer = CPU();

  expect(JSON.stringify(playerOne.actions)).toEqual(
    JSON.stringify(humanPlayer)
  );
  expect(JSON.stringify(playerTwo.actions)).toEqual(JSON.stringify(cpuPlayer));
});

it('startNewGame() creates gameboards', () => {
  const gameboard = Gameboard();

  expect(JSON.stringify(playerOne.gameboard)).toEqual(
    JSON.stringify(gameboard)
  );
});

it('startNewGame() begins on the right turn', () =>
  expect(newGame.state.turn).toEqual(playerOne));

// it('onBoardClick() correctly changes turn', () => {
//   gameLoop.onBoardClick(newGame, [1, 1]);

//   expect(newGame.state.turn).toEqual(playerTwo);
// });
it('onBoardClick() sends attack to cpu gameboard', () => {
  const game = gameLoop.startNewGame();
  gameLoop.onBoardClick(game, [1, 1]);
  const { playerTwo } = game;

  expect(playerTwo.gameboard.allShots.length).toBe(1);
});
it('onBoardClick() hits correct coordinates', () => {
  const game = gameLoop.startNewGame();
  gameLoop.onBoardClick(game, [1, 1]);
  const { playerTwo } = game;

  expect(playerTwo.gameboard.allShots[0]).toEqual([1, 1]);
});
it('onBoardClick() handles cpu turn', () => {
  const game = gameLoop.startNewGame('cpu');
  gameLoop.onBoardClick(game, [1, 1]);
  const { playerOne } = game;

  expect(playerOne.gameboard.allShots.length).toBe(1);
});
