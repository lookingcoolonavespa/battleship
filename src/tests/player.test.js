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

it('cpuAttack() doesnt select illegal moves', () => {
  const gameboard = Gameboard();
  const cpu = CPU();
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      gameboard.allShots.push([i, j]);
    }
  }
  gameboard.allShots.pop();
  const cpuAttack = cpu.attack(gameboard);

  expect(cpuAttack[0]).toBe(8);
  expect(cpuAttack[1]).toBe(8);
});

it('cpuAttack sends attack to gameboard', () => {
  const gameboard = Gameboard();
  const cpu = CPU();
  const [coordX, coordY] = cpu.attack(gameboard);

  expect(gameboard.missedShots[0][0]).toBe(coordX);
  expect(gameboard.missedShots[0][1]).toBe(coordY);
});
