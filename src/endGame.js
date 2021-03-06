import animate from './animate.js';

const endgame = (() => {
  const ctn = document.getElementById('endgame');
  const text = ctn.querySelector('.story-text');
  const newGameBtn = ctn.querySelector('.text-btn');

  return {
    ctn,
    newGameBtn,
    display(str, duration) {
      text.textContent = str;
      return animate.typing(text, duration);
    },
  };
})();

export default endgame;
