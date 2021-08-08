import { expect, it } from '@jest/globals';
import { Player, CPU } from '../player.js';
import Gameboard from '../gameboard.js';

// it('attack() sends the attack to the gameboard', () => {
//   const gameboard = Gameboard();
//   const player = Player();

//   player.attack(gameboard, [1, 1]);
//   expect(gameboard.missedShots.length).toBe(1);
// });

// it('attack() sends the right coordiantes to gameboard', () => {
//   const gameboard = Gameboard();
//   const player = Player();
//   player.attack(gameboard, [1, 2]);

//   expect(gameboard.missedShots[0][0]).toBe(1);
//   expect(gameboard.missedShots[0][1]).toBe(2);
// });

// it('cpuAttack sends attack to gameboard', () => {
//   const gameboard = Gameboard();
//   const cpu = CPU();
//   const { coord } = cpu.attack(gameboard);

//   expect(gameboard.missedShots[0][0]).toBe(coord[0]);
//   expect(gameboard.missedShots[0][1]).toBe(coord[1]);
// });

it('cpu attacks coords in opposite direction after miss on x axis', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  playerGameboard.receiveAttack([3, 1]);
  playerGameboard.receiveAttack([4, 1]);

  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);

  const expectedShots = [
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [2, 1],
    [1, 1],
  ];
  expect(playerGameboard.allShots).toEqual(expectedShots);
});

it('cpu attacks coords in opposite direction after miss on y axis', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'y');
  const cpu = CPU();
  playerGameboard.receiveAttack([1, 3]);
  playerGameboard.receiveAttack([1, 4]);

  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);

  const expectedShots = [
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 2],
    [1, 1],
  ];
  expect(playerGameboard.allShots).toEqual(expectedShots);
});

it('cpu uses original hit coord to generate moves after hitting adjacent ships and missing ', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [3, 3], 'y');
  playerGameboard.placeShip('carrier', 5, [4, 3], 'y');
  const cpu = CPU();
  playerGameboard.receiveAttack([3, 5]);
  playerGameboard.receiveAttack([4, 5]);

  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);

  expect(playerGameboard.ships[1].whereHit.length).toBeGreaterThanOrEqual(2);
});
it('cpu attacks random coord after ship sinks', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [3, 3], 'y');
  const cpu = CPU();

  playerGameboard.receiveAttack([3, 5]);
  playerGameboard.receiveAttack([3, 6]);

  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  const { result } = cpu.attack(playerGameboard);

  expect(result).toBe('miss');
});
