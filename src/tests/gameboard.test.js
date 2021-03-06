import { expect, it } from '@jest/globals';
import Gameboard from '../gameboard.js';

it('gameboard is correct size', () => {
  const gameboard = Gameboard();
  expect(gameboard.board.length).toBe(100);
});

it('placeShip() places ship w/ correct length', () => {
  const gameboard = Gameboard();

  gameboard.placeShip('carrier', 5, [1, 1], 'y');

  expect(gameboard.board.filter((coord) => coord.ship).length).toBe(5);
});

it('placeShip() places ship on correct coordinates', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('carrier', 5, [1, 1], 'y');
  const coordObjs = gameboard.board.filter((coord) => coord.ship);
  const coordinates = [];
  coordObjs.forEach((obj) => coordinates.push(obj.coord));

  expect(coordinates).toEqual([
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
  ]);
});

it('placeShip() doesnt go beyond edge of board', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('carrier', 5, [1, 6], 'y');
  expect(gameboard.board.filter((coord) => coord.ship).length).toBe(0);
});

it('placeShip() works on both Y and X axis', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('carrier', 5, [1, 1], 'x');
  const coordObjs = gameboard.board.filter((coord) => coord.ship);
  const coordinates = [];
  coordObjs.forEach((obj) => coordinates.push(obj.coord));

  expect(coordinates).toEqual([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
  ]);
});

it('placeShip() doesnt overlap other ships', () => {
  const gameboard = Gameboard();
  const shipOne = gameboard.placeShip('carrier', 5, [1, 1], 'y');
  gameboard.placeShip('carrier', 5, [1, 2], 'y');

  expect(
    gameboard.board.find((obj) => obj.coord[0] === 1 && obj.coord[1] === 1).ship
  ).toEqual(shipOne);
});

it('receiveAttack() records missed shots', () => {
  const gameboard = Gameboard();
  gameboard.receiveAttack([1, 1]);
  expect(gameboard.missedShots[0]).toEqual([1, 1]);
});

it('receiveAttack() fires hit() for the correct ship', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip('carrier', 5, [1, 1], 'y');
  gameboard.receiveAttack([1, 1]);

  expect(ship.whereHit.length).toEqual(1);
});

it('receiveAttack() fires hit() for the correct position', () => {
  const gameboard = Gameboard();
  const ship = gameboard.placeShip('carrier', 5, [1, 1], 'y');
  gameboard.receiveAttack([1, 1]);

  expect(ship.whereHit[0]).toEqual([1, 1]);
});

it('checkIfAllShipsSunk() should return false if not all ships have been sunk', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('carrier', 5, [1, 1], 'y');

  expect(gameboard.checkIfAllShipsSunk()).toBe(false);
});

it('checkIfAllShipsSunk() should not return false if all ships have been sunk', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('a', 1, [1, 1], 'y');
  gameboard.receiveAttack([1, 1]);

  expect(gameboard.checkIfAllShipsSunk()).toBe(true);
});

it('checkIfAllShipsSunk() should be able to check multiple sunk ships', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('a', 1, [1, 1], 'y');
  gameboard.receiveAttack([1, 1]);

  gameboard.placeShip('a', 1, [1, 2], 'y');
  gameboard.receiveAttack([1, 2]);

  gameboard.placeShip('a', 1, [1, 3], 'y');
  gameboard.receiveAttack([1, 3]);

  expect(gameboard.checkIfAllShipsSunk()).toBe(true);
});

it('checkIfAllShipsSunk() should be able to check multiple sunk ships', () => {
  const gameboard = Gameboard();
  gameboard.placeShip('a', 1, [1, 1], 'y');
  gameboard.receiveAttack([1, 1]);

  gameboard.placeShip('a', 1, [1, 2], 'y');
  gameboard.receiveAttack([1, 2]);

  gameboard.placeShip('a', 1, [1, 3], 'y');

  expect(gameboard.checkIfAllShipsSunk()).toBe(false);
});
