import startSeq from './startSeq.js';
import commandCenter from './commandCenter.js';

// startSeq events
startSeq.startBtn.addEventListener('click', startSeq.startMission);
startSeq.soundBtns.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    startSeq.turnVol(e);
    startSeq.changeVolBtn(e);
  })
);

// commandCenter events
const cc = commandCenter;
console.log(cc.shipList);
cc.axisBtn.addEventListener('click', cc.changeAxis);
cc.placeShipSeq(
  cc.shipList[cc.state.iterator].name,
  cc.shipList[cc.state.iterator].length,
  cc.map
);
