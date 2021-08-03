import { expect, it } from '@jest/globals';
import { test } from 'jest-circus';
import Ship from '../ship.js';

it('hit() updates whereHit', () => {
  const ship = Ship('carrier', 5);
  ship.hit(2);
  expect(ship.whereHit[0]).toBe(2);
});

it('isSunk() marks sunk when all positions have been hit', () => {
  const ship = Ship('carrier', 5);
  ship.hit(1);
  ship.hit(2);
  ship.hit(3);
  ship.hit(4);
  ship.hit(5);
  expect(ship.isSunk()).toBe(true);
});

it('isSunk() doesnt send false positives', () => {
  const ship = Ship('carrier', 5);
  ship.hit(1);
  ship.hit(2);
  ship.hit(3);
  ship.hit(4);
  expect(ship.isSunk()).toBe(false);
});
