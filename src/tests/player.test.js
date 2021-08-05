import { expect, it } from '@jest/globals';
import { Player, CPU } from '../player.js';
import Gameboard from '../gameboard.js';

it('attack() sends the attack to the gameboard', () => {
  const gameboard = Gameboard();
  const player = Player();

  player.attack(gameboard, [1, 1]);
  expect(gameboard.missedShots.length).toBe(1);
});

it('attack() sends the right coordiantes to gameboard', () => {
  const gameboard = Gameboard();
  const player = Player();
  player.attack(gameboard, [1, 2]);

  expect(gameboard.missedShots[0][0]).toBe(1);
  expect(gameboard.missedShots[0][1]).toBe(2);
});

it('cpuAttack sends attack to gameboard', () => {
  const gameboard = Gameboard();
  const cpu = CPU();
  const { coord } = cpu.attack(gameboard);

  expect(gameboard.missedShots[0][0]).toBe(coord[0]);
  expect(gameboard.missedShots[0][1]).toBe(coord[1]);
});

it('generateCoordsOnHit() generates 4 coords', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);

  const expected = {
    hitCoord: [1, 1],
    left: [0, 1],
    right: [2, 1],
    up: [1, 0],
    down: [1, 2],
  };

  expect(cpu.coordsToTryNext).toEqual(expected);
});

it('cpu uses coordsToTryNext if last shot was a hit', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);
  const { result, coordIndex } = cpu.attack(playerGameboard);
  const coords = [];
  for (const key in cpu.coordsToTryNext) {
    coords.push(cpu.coordsToTryNext[key]);
  }

  if (result === 'miss')
    expect(coords).toContainEqual(playerGameboard.board[coordIndex].coord);
});

it('cpu removes useless coords after successive hits', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);
  cpu.attack(playerGameboard, [2, 1]);

  expect(cpu.coordsToTryNext.down).toBe(null);
});

it('cpu moves in right direction after successive hits', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);
  cpu.attack(playerGameboard, [2, 1]);
  const { coord } = cpu.attack(playerGameboard);

  expect(coord[0]).toBe(3);
  expect(coord[1]).toBe(1);
});

it('cpu moves in right direction until ship sinks', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);
  cpu.attack(playerGameboard, [2, 1]);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);

  expect(playerGameboard.ships[0].sunk).toBeTruthy();
});

it('cpu attacks random coord after ship sinks', () => {
  const playerGameboard = Gameboard();
  playerGameboard.placeShip('carrier', 5, [1, 1], 'x');
  const cpu = CPU();
  cpu.attack(playerGameboard, [1, 1]);
  cpu.attack(playerGameboard, [2, 1]);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  cpu.attack(playerGameboard);
  console.log(cpu.attack(playerGameboard));
});
