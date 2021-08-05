import startSeq from './startSeq.js';
import commandCenter from './commandCenter.js';
import helpers from './helpers.js';
import animate from './animate.js';
import gameplay from './gameplay.js';
import endgame from './endGame.js';

// startSeq events
const cc = commandCenter;
startSeq.startBtn.addEventListener('click', () => {
  startSeq.startMission().then(() => quickStart());
});
startSeq.soundBtns.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    startSeq.turnVol(e);
    startSeq.changeVolBtn(e);
  })
);

startSeq.quickStartBtn.addEventListener('click', () =>
  animate.fadeOut(startSeq.start, 1).then(() => quickStart(startSeq.start))
);
// commandCenter events
cc.axisBtn.addEventListener('click', cc.changeAxis);

// endgame events
endgame.newGameBtn.addEventListener('click', () => {
  animate.fadeOut(endgame.ctn, 1).then(() => quickStart(endgame.ctn));
});

function quickStart(pageClose) {
  if (pageClose) helpers.hide(pageClose);
  const playerGameboard = cc.createNewGameboard();
  helpers.show(cc.ctn);
  animate
    .fadeIn(cc.ctn, 1)
    .then(() => {
      return cc.placeShipSeq(playerGameboard);
    })
    .then(() => animate.fadeOut(cc.ctn, 1))
    .then(() => {
      helpers.hide(cc.ctn);
      helpers.show(gameplay.ctn);
      animate.fadeIn(gameplay.ctn, 3);
      gameplay.startNewGame(playerGameboard);
    });
}
