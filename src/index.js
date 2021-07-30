import startSeq from './startSeq.js';
import commandCenter from './commandCenter.js';
import helpers from './helpers.js';
import animate from './animate.js';

// startSeq events
const cc = commandCenter;
startSeq.startBtn.addEventListener('click', () => {
  startSeq
    .startMission()
    .then(() => {
      helpers.show(cc.ctn);
      return animate.fadeIn(cc.ctn, 1);
    })
    .then(() => cc.placeShipSeq())
    .then(() => console.log('hi'));
});
startSeq.soundBtns.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    startSeq.turnVol(e);
    startSeq.changeVolBtn(e);
  })
);

// commandCenter events
cc.axisBtn.addEventListener('click', cc.changeAxis);
