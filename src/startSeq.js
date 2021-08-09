import helpers from './helpers.js';
import animate from './animate.js';
import audio from './audio.js';

const startSeq = (function () {
  const start = document.getElementById('start');
  const title = start.querySelector('.title');
  const startBtn = start.querySelector('.start-btn');
  const quickStartBtn = start.querySelector('.quick-start-btn');
  const btnCtn = start.querySelector('.btn-ctn');

  const storyPt1 = document.querySelector('.story-text-1');
  const storyPt2 = document.querySelector('.story-text-2');
  const storyPt3 = document.querySelector('.story-text-3');

  const alert = document.getElementById('alert');

  return {
    start,
    startBtn,
    quickStartBtn,
    async startMission() {
      animate.fadeOut(quickStartBtn, 1);
      return animate
        .fadeOut(startBtn, 1)
        .then(() => {
          btnCtn.classList.add('sound-only');
          return animate.reverseTyping(title);
        })
        .then(() => showNextLine(title, storyPt1))
        .then(() => showNextLine(storyPt1, storyPt2))
        .then(() => showNextLine(storyPt2, storyPt3))
        .then(() => animate.fadeOut(start, 3))
        .then(() => {
          helpers.hide(start);
          alert.classList.add('fade-anime-3');
          helpers.show(alert);
          return animate.alert();
        })
        .then(() => {
          const audioFadeOut = setInterval(() => {
            audio.fadeOut(audio.alert, 0.05, audioFadeOut);
          }, 300);
          return animate.fadeOut(alert, 3);
        })
        .then(() => helpers.hide(alert));

      function showNextLine(prev, next) {
        helpers.hide(prev);
        helpers.show(next);
        return animate.typing(next, 2000);
      }
    },
  };
})();

export default startSeq;
