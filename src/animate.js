import audio from './audio.js';

const animate = (() => ({
  typing: function (el) {
    let index = 0;
    const str = el.textContent.trim();
    return new Promise((resolve) => {
      (function showNextLetter() {
        const letter = str.slice(0, index++);
        audio.typing.play();
        el.textContent = letter;
        if (letter.length === str.length) {
          el.classList.add('type-anime');
          audio.typing.pause();
          return setTimeout(() => resolve(), 2000);
        }
        setTimeout(showNextLetter, 80);
      })();
    });
  },
  reverseTyping: function (el) {
    const str = el.textContent.trim();
    let index = str.length - 1;
    el.classList.remove('type-anime');
    audio.backspace.playbackRate = 1.5;
    return new Promise((resolve) => {
      (function removeNextLetter() {
        audio.backspace.pause();
        audio.backspace.currentTime = 0;
        audio.backspace.play();
        const remainingWord = str.slice(0, index--);
        el.textContent = remainingWord;
        if (remainingWord.length === 0) {
          el.classList.add('type-anime');
          return setTimeout(() => resolve(), 2000);
        }
        setTimeout(removeNextLetter, 300);
      })();
    });
  },
  fadeOut: function (el, duration) {
    return new Promise((resolve) => {
      el.classList.add(`fade-anime-${duration}`);
      el.style.opacity = '0';
      el.addEventListener('transitionend', transitionEnded);

      function transitionEnded(e) {
        if (e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', transitionEnded);
        resolve();
      }
    });
  },
  alert: function () {
    audio.alert.playbackRate = 0.8;
    const vol = 0;
    audio.alert.volume = vol;
    const fadeIn = setInterval(() => {
      audio.fadeIn(audio.alert, 0.02, 0.4, fadeIn);
    }, 200);
    audio.alert.play();
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve();
      }, 6300);
    });
  },
}))();

export default animate;
