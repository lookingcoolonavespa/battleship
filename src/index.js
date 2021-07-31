import startSeq from './startSeq.js';
import commandCenter from './commandCenter.js';
import helpers from './helpers.js';
import animate from './animate.js';
import gameplay from './gameplay.js';

// startSeq events
const cc = commandCenter;
startSeq.startBtn.addEventListener('click', () => {
  startSeq
    .startMission()
    .then(() => {
      helpers.show(cc.ctn);
      return animate.fadeIn(cc.ctn, 1);
    })
    .then(() => cc.placeShipSeq(cc.playerGameboard.shipList))
    .then(() => console.log('hi'));
});
startSeq.soundBtns.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    startSeq.turnVol(e);
    startSeq.changeVolBtn(e);
  })
);

startSeq.quickStartBtn.addEventListener('click', () => {
  helpers.show(cc.ctn);
  animate
    .fadeIn(cc.ctn, 1)
    .then(() => cc.placeShipSeq(cc.playerGameboard.shipList))
    .then(() => console.log('hi'));
});
// commandCenter events
cc.axisBtn.addEventListener('click', cc.changeAxis);

// gameplay events
const currentGame = gameplay.startNewGame('cpu');
const cpuGameboard = currentGame.playerTwo.gameboard;
const gridBoxes = cpuGameboard.div.querySelectorAll('.grid-box');

gridBoxes.forEach((box, index) => {
  box.addEventListener('click', () => {
    const coord = cpuGameboard.board[index].coord;
    gameplay.onBoardClick(currentGame, coord, box);
  });
});
