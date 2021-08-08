import audio from './audio.js';

const soundBtns = (() => {
  const btns = document.querySelectorAll('.sound-btn');
  return {
    btns,
    turnVol() {
      const icon = btns[0].querySelector('i');
      if (icon.classList.contains('fa-volume-mute')) {
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
