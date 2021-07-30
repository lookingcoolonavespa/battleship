import Gameboard from './gameboard.js';
import animate from './animate.js';
import audio from './audio.js';

const commandCenter = (() => {
  const ctn = document.getElementById('command-center');
  const playerGameboard = Gameboard();
  const map = playerGameboard.generateGameboardEl(ctn);
  const instructions = ctn.querySelector('.instructions');
  const shipNameEl = ctn.querySelector('#ship-name');

  const axisBtn = ctn.querySelector('.axis-btn');
  const axisText = axisBtn.querySelector('#axis-text');
  const state = {
    axis: axisText.textContent,
    iterator: 0,
  };

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
    ctn,
    state,
    shipList,
    map,
    axisBtn,
    playerGameboard,
    placeShipSeq(name, length, gameboard) {
      if (shipNameEl.textContent) audio.backspace.play();
      shipNameEl.textContent = '';
      setTimeout(() => {
        shipNameEl.textContent = name;
        animate.typing(shipNameEl);
      }, 300);

      const gridBoxes = [...gameboard.querySelectorAll('.grid-box')];
      gridBoxes.forEach((gridBox) => {
        gridBox.onmouseover = (e) => shipline('show', e);
        gridBox.onmouseleave = (e) => shipline('hide', e);
        gridBox.onclick = (e) => placeShip.call(this, e);
      });

      function shipline(visibility, e) {
        const shiplineStart = gridBoxes.findIndex(
          (gridBox) => gridBox === e.target
        );

        const shiplineIndexes = figureOutShipline(shiplineStart);

        shiplineIndexes.forEach((index) => {
          visibility === 'show'
            ? gridBoxes[index].classList.add('grid-box-shipline')
            : gridBoxes[index].classList.remove(
                'grid-box-shipline',
                'grid-box-error'
              );

          if (
            visibility === 'show' &&
            gridBoxes[index].classList.contains('grid-box-ship')
          )
            gridBoxes[index].classList.add('grid-box-error');
        });
      }
      function placeShip(e) {
        const shiplineStart = gridBoxes.findIndex(
          (gridBox) => gridBox === e.target
        );
        const shiplineIndexes = figureOutShipline(shiplineStart);
        if (
          shiplineIndexes.some((index) =>
            gridBoxes[index].classList.contains('grid-box-error')
          )
        )
          return;

        shiplineIndexes.forEach((index) =>
          gridBoxes[index].classList.add('grid-box-ship')
        );

        const shipStartCoord = playerGameboard.board[shiplineStart].coord;
        playerGameboard.placeShip(
          shipStartCoord,
          length,
          state.axis.toLowerCase()
        );

        state.iterator++;
        if (state.iterator < shipList.length) {
          return this.placeShipSeq(
            shipList[state.iterator].name,
            shipList[state.iterator].length,
            map
          );
        }

        gridBoxes.forEach((gridBox) => {
          gridBox.onmouseover = '';
          gridBox.onmouseleave = '';
          gridBox.onclick = '';
        });
        instructions.textContent =
          'Admiral, all ships deployed. Preparing to engage the enemy';
        instructions.classList.add('story-text');
        animate.typing(instructions);
      }

      function figureOutShipline(startIndex) {
        let shiplineStart = startIndex;
        const shiplineIndexes = [];

        if (state.axis.toLowerCase() === 'y') {
          const howCloseStartIsFromColumnEnd =
            (playerGameboard.size ** 2 - // need to figure out the index of the bottom most gridBox in that column
              playerGameboard.size +
              (shiplineStart % playerGameboard.size) -
              (shiplineStart + (length - 1) * playerGameboard.size)) / // this calculates the index of the shipline end
            playerGameboard.size; // need to divide by column length to see how many rows left to get to the bottom

          if (howCloseStartIsFromColumnEnd < 0)
            shiplineStart +=
              howCloseStartIsFromColumnEnd * playerGameboard.size;

          shiplineIndexes.push(shiplineStart);
          for (let i = 0; i < length - 1; i++) {
            const shipCoord = shiplineIndexes[i] + playerGameboard.size;
            shiplineIndexes.push(shipCoord);
          }
        }

        if (state.axis.toLowerCase() === 'x') {
          const howCloseStartIsFromRowEnd =
            shiplineStart % playerGameboard.size;
          if (
            (howCloseStartIsFromRowEnd + length) % playerGameboard.size <
            length
          ) {
            shiplineStart -=
              (howCloseStartIsFromRowEnd + length) % playerGameboard.size;
          }

          const shiplineEnd = shiplineStart + length;
          for (let i = shiplineStart; i < shiplineEnd; i++) {
            shiplineIndexes.push(i);
          }
        }
        return shiplineIndexes;
      }
    },
    changeAxis() {
      if (axisText.textContent === 'X') {
        axisText.textContent = 'Y';
        state.axis = 'y';
        return;
      }
      axisText.textContent = 'X';
      state.axis = 'x';

      this.placeShipSeq(
        shipList[state.iterator].name,
        shipList[state.iterator].length,
        map
      );
    },
  };
})();

export default commandCenter;
