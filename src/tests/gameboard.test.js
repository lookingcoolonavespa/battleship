import { expect, it } from '@jest/globals';
import { test } from 'jest-circus';
import Gameboard from '../gameboard';

it('gameboard is correct size', () => {
  const gameboard = Gameboard();
  console.log(gameboard.board);
  expect(gameboard.board.length).toBe(100);
});
