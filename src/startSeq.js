import helpers from './helpers.js';
import animate from './animate.js';
import audio from './audio.js';

const startSeq = (function () {
  const start = document.getElementById('start');
  const storyPrequel = document.querySelector('.story-text-prequel');
  const storyPt1 = document.querySelector('.story-text-1');
  const storyPt2 = document.querySelector('.story-text-2');
  const storyPt3 = document.querySelector('.story-text-3');
  const startBtn = document.querySelector('.start-btn');

  const alert = document.getElementById('alert');

  const gameplay = document.getElementById('gameplay');

  animate
    .typingEffect(storyPrequel)
    .then(() => {
      helpers.hide(storyPrequel);
      helpers.show(storyPt1);
      return animate.typingEffect(storyPt1);
    })
    .then(() => {
      helpers.hide(storyPt1);
      helpers.show(storyPt2);
      return animate.typingEffect(storyPt2);
    })
    .then(() => {
      helpers.hide(storyPt2);
      helpers.show(storyPt3);
      return animate.typingEffect(storyPt3);
    })
    .then(() => {
      helpers.show(startBtn);
    });

  startBtn.addEventListener('click', startMission);

  function startMission() {
    start.classList.add('fade-anime');
    animate
      .fadeOut(start)
      .then(() => {
        helpers.hide(start);
        helpers.show(alert);
        return animate.alert();
      })
      .then(() => {
        return animate.fadeOut(alert);
      })
      .then(() => {
        audio.alert.pause();
        helpers.hide(alert);
        helpers.show(gameplay);
      });
  }
})();

export default startSeq;
