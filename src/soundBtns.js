import audio from './audio.js';

const soundBtns = (() => {
  const btns = document.querySelectorAll('.sound-btn');
  return {
    btns,
    turnVol(e) {
      const icon = e.target;
      if (icon.classList.contains('fa-volume-up')) {
        return audio.muteAll();
      }
      audio.unmuteAll();
    },
    changeVolBtn() {
      btns.forEach((btn) => {
        const icon = btn.querySelector('i');
        icon.classList.contains('fa-volume-up')
          ? icon.classList.replace('fa-volume-up', 'fa-volume-mute')
          : icon.classList.replace('fa-volume-mute', 'fa-volume-up');
      });
    },
  };
})();

export default soundBtns;
