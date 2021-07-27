import helpers from './helpers.js';
import animate from './animate.js';
import audio from './audio.js';

const startSeq = (function () {
  const start = document.getElementById('start');
  const title = start.querySelector('.title');
  const btnCtn = start.querySelector('.btn-ctn');

  const storyPrequel = document.querySelector('.story-text-prequel');
  const storyPt1 = document.querySelector('.story-text-1');
  const storyPt2 = document.querySelector('.story-text-2');
  const storyPt3 = document.querySelector('.story-text-3');
  const startBtn = document.querySelector('.start-btn');

  const alert = document.getElementById('alert');

  const gameplay = document.getElementById('gameplay');

  startBtn.addEventListener('click', startMission);

  function startMission() {
    helpers.hide(btnCtn);
    animate
      .fadeOut(btnCtn, 1)
      .then(() => {
        return animate.reverseTyping(title);
      })
      .then(() => {
        helpers.hide(title);
        helpers.show(storyPt1);
        return animate.typing(storyPt1);
      })
      .then(() => {
        helpers.hide(storyPt1);
        helpers.show(storyPt2);
        return animate.typing(storyPt2);
      })
      .then(() => {
        helpers.hide(storyPt2);
        helpers.show(storyPt3);
        return animate.typing(storyPt3);
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
          audio.fadeOut(audio.alert, 0.02, audioFadeOut);
        }, 50);
        return animate.fadeOut(alert, 3);
      })
      .then(() => {
        helpers.show(gameplay);
      });
  }
})();

export default startSeq;
