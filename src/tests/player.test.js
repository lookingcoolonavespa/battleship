import { expect, it } from '@jest/globals';
import Player from '../player.js';
import Gameboard from '../gameboard.js';

it('attack() sends the attack to the gameboard', () => {
  const gameboard = Gameboard();
  const player = Player();

  player.attack(1, 1, gameboard);
  expect(gameboard.missedShots.length).toBe(1);
});

it('attack() sends the right coordiantes to gameboard', () => {
  const gameboard = Gameboard();
  const player = Player();
  player.attack(1, 2, gameboard);

  expect(gameboard.missedShots[0][0]).toBe(1);
  expect(gameboard.missedShots[0][1]).toBe(2);
});

it('cpuAttack() doesnt select illegal moves', () => {
  const gameboard = Gameboard();
  const cpu = Player();
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      gameboard.allShots.push([i, j]);
    }
  }
  gameboard.allShots.pop();
  const cpuAttack = cpu.cpuAttack(gameboard);

  expect(cpuAttack[0]).toBe(10);
  expect(cpuAttack[1]).toBe(10);
});

it('cpuAttack sends attack to gameboard', () => {
  const gameboard = Gameboard();
  const cpu = Player();
  const [coordX, coordY] = cpu.cpuAttack(gameboard);

  expect(gameboard.missedShots[0][0]).toBe(coordX);
  expect(gameboard.missedShots[0][1]).toBe(coordY);
});
