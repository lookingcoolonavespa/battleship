import Ship from './ship.js';

const Gameboard = () => {
  // should keep track of all missed attacks so they can be displayed

  // should be able to report if all ships have been sunk

  const gameboardSize = 10;

  function findCoord(coordX, coordY) {
    return this.board.find(
      (obj) => coordX === obj.coord[0] && coordY === obj.coord[1]
    );
  }

  return {
    size: gameboardSize,
    board: (function createBoardObj() {
      const arr = [];
      for (let xCoord = 1; xCoord <= gameboardSize; xCoord++) {
        for (let yCoord = 1; yCoord <= gameboardSize; yCoord++) {
          const coord = { coord: [xCoord, yCoord] };
          arr.push(coord);
        }
      }
      return arr;
    })(),
    missedShots: [],
    allShots: [],
    ships: [],
    div: (function generateGameboardEl() {
      const gameboardDiv = document.createElement('div');
      gameboardDiv.classList.add('gameboard');

      for (let i = 1; i < Math.pow(gameboardSize, 2) + 1; i++) {
        const gridBox = document.createElement('div');
        gridBox.classList.add('grid-box');
        gameboardDiv.appendChild(gridBox);

        if (i % gameboardSize === 0) gridBox.classList.add('grid-box-col-8'); // if gridbox is in the last column
        if (i > gameboardSize ** 2 - gameboardSize)
          // if gridbox is in the last row
          gridBox.classList.add('grid-box-row-8');
      }
      return gameboardDiv;
    })(),
    placeShip(startCoord, length, direction) {
      const [coordX, coordY] = startCoord;
      if (
        (length + coordX > gameboardSize && direction === 'x') ||
        (length + coordY > gameboardSize && direction === 'y')
      )
        return;

      const shipCoords = [];
      for (let i = 0; i < length; i++) {
        const coord =
          direction === 'vertical'
            ? findCoord.call(this, coordX, coordY + i)
            : findCoord.call(this, coordX + i, coordY);
        shipCoords.push(coord);
      }
      if (shipCoords.some((coordObj) => coordObj.ship) === true) return; // check if there is a ship on any of the coordinates
      const ship = Ship(length);
      this.ships.push(ship);
      shipCoords.forEach((coord) => {
        let j = 0;
        coord.ship = ship;
        coord.shipPos = j + 1;
        j++;
      });
      return ship;
    },
    receiveAttack(coord) {
      const [coordX, coordY] = coord;
      const coordObj = findCoord.call(this, coordX, coordY);
      coordObj.ship
        ? coordObj.ship.hit(coordObj.shipPos)
        : this.missedShots.push([coordX, coordY]);

      this.allShots.push([coordX, coordY]);
    },
    checkIfAllShipsSunk() {
      const sunkStatus = [];
      this.ships.forEach((ship) => sunkStatus.push(ship.isSunk()));

      return sunkStatus.every((val) => val === true);
    },
  };
};

export default Gameboard;
