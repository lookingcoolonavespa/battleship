import { Ship } from './ship.js';

const Gameboard = () => {
  // should keep track of all missed attacks so they can be displayed

  // should be able to report if all ships have been sunk

  return {
    board: (function createBoardObj() {
      const arr = [];
      for (let xCoord = 1; xCoord < 11; xCoord++) {
        for (let yCoord = 1; yCoord < 11; yCoord++) {
          const coord = { coord: [xCoord, yCoord] };
          arr.push(coord);
        }
      }
      return arr;
    })(),
    placeShip(coordX, coordY, length) {
      const ship = Ship(length);
    },
    receiveAttack(coordX, coordY) {
      // takes coordinates, determines whether attack hit a ship,
      // sends hit function to correct ship if it hits
      // records coordinates of the missedd shot
    },
  };
};

export default Gameboard;
