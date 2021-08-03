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
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      gameboard.allShots.push([i, j]);
    }
  }
  gameboard.allShots.pop();
  const cpuAttackResults = cpu.attack(gameboard);
  const { coordIndex } = cpuAttackResults;
  const attkCoords = gameboard.board[coordIndex];

  expect(attkCoords[0]).toBe(10);
  expect(attkCoords[1]).toBe(10);
});

it('cpuAttack sends attack to gameboard', () => {
  const gameboard = Gameboard();
  const cpu = CPU();
  const { coordIndex } = cpu.attack(gameboard);
  const attkCoords = gameboard.board[coordIndex];
  expect(gameboard.missedShots[0][0]).toBe(attkCoords[0]);
  expect(gameboard.missedShots[0][1]).toBe(attkCoords[1]);
});
