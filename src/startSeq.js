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

  const soundBtns = document.querySelectorAll('.sound-btn');

  return {
    start,
    startBtn,
    quickStartBtn,
    soundBtns,
    startMission() {
      animate.fadeOut(quickStartBtn, 1);
      return animate
        .fadeOut(startBtn, 1)
        .then(() => {
          btnCtn.classList.add('sound-only');
          return animate.reverseTyping(title);
        })
        .then(() => {
          helpers.hide(title);
          helpers.show(storyPt1);
          return animate.typing(storyPt1, 2000);
        })
        .then(() => {
          helpers.hide(storyPt1);
          helpers.show(storyPt2);
          return animate.typing(storyPt2, 2000);
        })
        .then(() => {
          helpers.hide(storyPt2);
          helpers.show(storyPt3);
          return animate.typing(storyPt3, 2000);
        })
        .then(() => {
          return animate.fadeOut(start, 3);
        })
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
        .then(() => {
          helpers.hide(alert);
        });
    },
    turnVol(e) {
      const icon = e.target;
      if (icon.classList.contains('fa-volume-up')) {
        return audio.muteAll();
      }
      audio.unmuteAll();
    },
    changeVolBtn() {
      soundBtns.forEach((btn) => {
        const icon = btn.querySelector('i');
        icon.classList.contains('fa-volume-up')
          ? icon.classList.replace('fa-volume-up', 'fa-volume-mute')
          : icon.classList.replace('fa-volume-mute', 'fa-volume-up');
      });
    },
  };
})();

export default startSeq;
