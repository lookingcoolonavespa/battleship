import Gameboard from './gameboard.js';

const commandCenter = (() => {
  const ctn = document.getElementById('command-center');
  const playerGameboard = Gameboard();
  const map = playerGameboard.generateGameboardEl(ctn);
  const shipNameEl = ctn.querySelector('#ship-name');

  const direction = 'y';

  const shipList = [];
  createShipListItem('carrier', 5);
  createShipListItem('battleship', 4);
  createShipListItem('cruiser', 3);
  createShipListItem('submarine', 3);
  createShipListItem('patrol boat', 2);
  console.log(shipList);

  function createShipListItem(name, length) {
    const listObj = {};
    listObj.name = name;
    listObj.length = length;
    shipList.push(listObj);
  }
  let i = 0;
  placeShipSeq(shipList[i].name, shipList[i].length, map);

  function placeShipSeq(name, length, gameboard) {
    shipNameEl.textContent = name;
    const gridBoxes = [...gameboard.querySelectorAll('.grid-box')];
    gridBoxes.forEach((gridBox) => {
      gridBox.onmouseover = (e) => shipline(e, 'show');
      gridBox.onmouseleave = (e) => shipline(e, 'hide');
      gridBox.onclick = (e) => placeShip(e);
    });

    function shipline(e, visibility) {
      const shiplineStart = gridBoxes.findIndex(
        (gridBox) => gridBox === e.target
      );

      const shiplineCoords = figureOutShipline(shiplineStart);

      shiplineCoords.forEach((coord) => {
        visibility === 'show'
          ? gridBoxes[coord].classList.add('grid-box-shipline')
          : gridBoxes[coord].classList.remove('grid-box-shipline');
      });
    }
    function placeShip(e) {
      const shiplineStart = gridBoxes.findIndex(
        (gridBox) => gridBox === e.target
      );
      const shiplineCoords = figureOutShipline(shiplineStart);

      shiplineCoords.forEach((coord) =>
        gridBoxes[coord].classList.add('grid-box-ship')
      );

      i++;
      if (i < shipList.length) {
        placeShipSeq(shipList[i].name, shipList[i].length, map);
      }
    }

    function figureOutShipline(startIndex) {
      let shiplineStart = startIndex;
      const shiplineCoords = [];

      if (direction === 'y') {
        const howCloseStartIsFromColumnEnd =
          (playerGameboard.size ** 2 - // need to figure out the index of the bottom most gridBox in that column
            playerGameboard.size +
            (shiplineStart % playerGameboard.size) -
            (shiplineStart + (length - 1) * playerGameboard.size)) / // this calculates the index of the shipline end
          playerGameboard.size; // need to divide by column length to see how many rows left to get to the bottom

        if (howCloseStartIsFromColumnEnd < 0)
          shiplineStart += howCloseStartIsFromColumnEnd * playerGameboard.size;

        shiplineCoords.push(shiplineStart);
        for (let i = 0; i < length - 1; i++) {
          const shipCoord = shiplineCoords[i] + playerGameboard.size;
          shiplineCoords.push(shipCoord);
        }
      }

      if (direction === 'x') {
        const howCloseStartIsFromRowEnd = shiplineStart % playerGameboard.size;
        if (
          (howCloseStartIsFromRowEnd + length) % playerGameboard.size <
          length
        ) {
          shiplineStart -=
            (howCloseStartIsFromRowEnd + length) % playerGameboard.size;
        }

        const shiplineEnd = shiplineStart + length;
        for (let i = shiplineStart; i < shiplineEnd; i++) {
          shiplineCoords.push(i);
        }
      }
      return shiplineCoords;
    }
  }
})();

export default commandCenter;
