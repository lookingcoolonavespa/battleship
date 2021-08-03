import { expect, it } from '@jest/globals';
import gameplay from '../gameplay.js';

const game = gameplay.startNewGame('cpu');
const { playerOne, playerTwo } = game;
it('onSunk() fires correctly', () => {
  playerOne.gameboard.placeShipsRandom();
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
