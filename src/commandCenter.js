import Gameboard from './gameboard.js';

const commandCenter = (() => {
  const ctn = document.getElementById('command-center');
  const playerGameboard = Gameboard();
  const map = playerGameboard.generateGameboardEl(ctn);
  const shipNameEl = ctn.querySelector('#ship-name');

  const direction = 'y';

  placeShip('carrier', 5, map);
  function placeShip(name, length, gameboard) {
    shipNameEl.textContent = name;
    const gridBoxes = [...gameboard.querySelectorAll('.grid-box')];
    gridBoxes.forEach((gridBox) => {
      gridBox.onmouseover = (e) => shipline(e, 'show');
      gridBox.onmouseleave = (e) => shipline(e, 'hide');
    });

    function shipline(e, visibility) {
      let shiplineStart = gridBoxes.findIndex(
        (gridBox) => gridBox === e.target
      );
      if (direction === 'y') {
        const howCloseStartIsFromColumnEnd =
          (playerGameboard.size ** 2 - // need to figure out the index of the bottom most gridBox in that column
            playerGameboard.size +
            (shiplineStart % 8) -
            (shiplineStart + (length - 1) * playerGameboard.size)) / // this calculates the end of the shipline
          playerGameboard.size; // need to divide by column length to see how many rows left to get to the bottom
        if (howCloseStartIsFromColumnEnd < 0)
          shiplineStart += howCloseStartIsFromColumnEnd * 8;
        const shiplineCoords = [shiplineStart];
        for (let i = 0; i < length - 1; i++) {
          const shipCoord = shiplineCoords[i] + playerGameboard.size;
          shiplineCoords.push(shipCoord);
        }
        shiplineCoords.forEach((coord) => {
          visibility === 'show'
            ? gridBoxes[coord].classList.add('grid-box-shipline')
            : gridBoxes[coord].classList.remove('grid-box-shipline');
        });
      }
      if (direction === 'x') {
        const howCloseStartIsFromRowEnd = shiplineStart % 8;
        if ((howCloseStartIsFromRowEnd + length) % 8 < length) {
          shiplineStart -= (howCloseStartIsFromRowEnd + length) % 8;
        }
        console.log(shiplineStart);
        const shiplineEnd = shiplineStart + length;

        for (let i = shiplineStart; i < shiplineEnd; i++) {
          visibility === 'show'
            ? gridBoxes[i].classList.add('grid-box-shipline')
            : gridBoxes[i].classList.remove('grid-box-shipline');
        }
      }
    }
  }
})();

export default commandCenter;
