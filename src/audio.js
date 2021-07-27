const audio = (() => {
  return {
    fadeIn(audio, step, maxVol, interval) {
      if (audio.volume > maxVol || audio.volume === maxVol)
        return clearInterval(interval);
      audio.volume += step;
    },
    fadeOut(audio, step, interval) {
      console.log(
        audio.volume,
        audio.volume === 0 || audio.volume < 0 || audio.volume - step < 0
      );
      if (audio.volume === 0 || audio.volume < 0 || audio.volume - step < 0) {
        audio.pause();
        return clearInterval(interval);
      }
      audio.volume -= step;
    },
    typing: new Audio(
      '../dist/audio/medium-pace-Typing-on-mechanical-keyboard-1-www.FesliyanStudios.com.mp3'
    ),
    alert: new Audio(
      '../dist/audio/zapsplat_emergency_alarm_beeps_low_pitched_warning_danger_69057.mp3'
    ),
    backspace: new Audio(
      '../dist/audio/truncated-Mechanical-Keyboard-single-button-presses-4-www.FesliyanStudios.com.mp3'
    ),
  };
})();

export default audio;
