import audio from './audio.js';

const animate = (() => ({
  typingEffect: function (el) {
    let index = 0;
    const str = el.textContent.trim();
    return new Promise((resolve) => {
      (function showNextLetter() {
        const letter = str.slice(0, index++);
        el.textContent = letter;
        audio.typing.play();
        if (letter.length === str.length) {
          el.classList.add('type-anime');
          audio.typing.pause();
          return setTimeout(() => resolve(), 2000);
        }
        setTimeout(showNextLetter, 80);
      })();
    });
  },
  fadeOut(el) {
    return new Promise((resolve) => {
      el.classList.add('fade-anime');
      el.style.opacity = '0';
      el.addEventListener('transitionend', transitionEnded);

      function transitionEnded(e) {
        if (e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', transitionEnded);
        resolve();
      }
    });
  },
  alert() {
    audio.alert.playbackRate = 0.8;
    const vol = 0;
    audio.alert.volume = vol;
    const fadeInAndOut = setInterval(() => {
      audio.fadeIn(audio.alert, 0.02, 0.5, fadeInAndOut);
    }, 200);
    audio.alert.play();
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve();
      }, 5800);
    });
  },
}))();

export default animate;
