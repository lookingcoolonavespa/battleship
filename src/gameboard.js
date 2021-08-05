import Ship from './ship.js';

const Gameboard = () => {
  const gameboardSize = 10;

  function findCoord(coordX, coordY) {
    return this.board.find(
      (obj) => coordX === obj.coord[0] && coordY === obj.coord[1]
    );
  }
  function findCoordIndex(coordX, coordY) {
    return this.board.findIndex(
      (obj) => coordX === obj.coord[0] && coordY === obj.coord[1]
    );
  }

  const shipList = [];
  createShipListItem('carrier', 5);
  createShipListItem('battleship', 4);
  createShipListItem('cruiser', 3);
  createShipListItem('submarine', 3);
  createShipListItem('patrol boat', 2);
  function createShipListItem(name, length) {
    const listObj = {};
    listObj.name = name;
    listObj.length = length;
    shipList.push(listObj);
  }

  return {
    shipList,
    size: gameboardSize,
    board: (function createBoardObj() {
      const arr = [];
      for (let yCoord = 1; yCoord <= gameboardSize; yCoord++) {
        for (let xCoord = 1; xCoord <= gameboardSize; xCoord++) {
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
        gridBox.classList.add('grid-box', 'grid-box-carrier');
        gameboardDiv.appendChild(gridBox);

        if (i % gameboardSize === 0) gridBox.classList.add('grid-box-col-8'); // if gridbox is in the last column
        if (i > gameboardSize ** 2 - gameboardSize)
          // if gridbox is in the last row
          gridBox.classList.add('grid-box-row-8');
      }

      const radar = createRadar();
      gameboardDiv.appendChild(radar);

      return gameboardDiv;

      function createRadar() {
        const radar = document.createElement('div');
        radar.classList.add('radar');
        const radarLine = document.createElement('li');
        radarLine.classList.add('radar-line');
        radar.appendChild(radarLine);
        radarLine.style.opacity = 0;
        return radar;
      }
    })(),
    placeShip(name, length, startCoord, direction) {
      const [coordX, coordY] = startCoord;
      if (
        (length + coordX - 1 > gameboardSize && direction === 'x') ||
        (length + coordY - 1 > gameboardSize && direction === 'y')
      )
        return null;

      const shipCoords = [];
      for (let i = 0; i < length; i++) {
        const coord =
          direction === 'y'
            ? findCoord.call(this, coordX, coordY + i)
            : findCoord.call(this, coordX + i, coordY);
        shipCoords.push(coord);
      }
      if (shipCoords.some((coordObj) => coordObj.ship) === true) return null; // check if there is a ship on any of the coordinates
      const ship = Ship(name, length);
      this.ships.push(ship);
      shipCoords.forEach((coordObj) => {
        ship.coords.push(coordObj.coord);
        coordObj.ship = ship;
      });
      return ship;
    },
    receiveAttack(coord) {
      const [coordX, coordY] = coord;
      this.allShots.push([coordX, coordY]);
      const coordObj = findCoord.call(this, coordX, coordY);
      let result = coordObj.ship ? 'hit' : 'miss';
      if (result === 'hit') {
        coordObj.ship.hit(coordObj.coord);
      }
      if (result === 'hit' && coordObj.ship.isSunk()) result = 'sunk';
      if (result === 'miss') this.missedShots.push(coord);
      return {
        result,
        coord,
        coordIndex: findCoordIndex.call(this, coordX, coordY),
      };
    },
    checkIfAllShipsSunk() {
      return this.ships.every((ship) => ship.sunk === true);
    },
    placeShipsRandom() {
      this.shipList.forEach((ship) => {
        let rdmCoord = generateRdmCoord();
        let rdmDirection = generateRdmDirection();
        while (
          this.placeShip(ship.name, ship.length, rdmCoord, rdmDirection) ===
          null
        ) {
          rdmCoord = generateRdmCoord();
          rdmDirection = generateRdmDirection();
        }

        function generateRdmCoord() {
          const coordX = Math.floor(Math.random() * 9) + 1;
          const coordY = Math.floor(Math.random() * 9) + 1;
          return [coordX, coordY];
        }
        function generateRdmDirection() {
          const directions = ['x', 'y'];
          const rdmDirection =
            directions[Math.floor(Math.random() * directions.length)];
          return rdmDirection;
        }
      });
    },
    destroyAllShipsButOne() {
      this.ships.forEach((ship, index) => {
        if (index === this.ships.length - 1) return;
        ship.coords.forEach((coord) => {
          this.receiveAttack(coord);
        });
      });
    },
  };
};

export default Gameboard;
