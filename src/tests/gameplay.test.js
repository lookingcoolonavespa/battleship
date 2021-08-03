import { expect, it } from '@jest/globals';
import gameplay from '../gameplay.js';

it('onSunk() fires correctly', () => {
  const game = gameplay.startNewGame('cpu');
  const { playerTwo } = game;
  let numOfShipCoords = 0;
  playerTwo.gameboard.ships.forEach((ship) => {
    ship.coords.forEach((coord) => {
      gameplay.onBoardClick(game, coord);
      numOfShipCoords++;
    });
  });
  const sunkShipGridBoxes =
    playerTwo.gameboard.div.querySelectorAll('.grid-box-sunk');

  expect(sunkShipGridBoxes.length).toBe(numOfShipCoords);
});

it('endGame() runs', () => {
  const game = gameplay.startNewGame('cpu');
  const { playerTwo } = game;
  playerTwo.gameboard.ships.forEach((ship) => {
    ship.coords.forEach((coord) => {
      gameplay.onBoardClick(game, coord);
    });
  });
  const gameEnded = document.querySelectorAll('.game-ended');

  expect(gameEnded.length).toBeGreaterThan(0);
});
