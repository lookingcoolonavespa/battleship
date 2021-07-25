const audio = (() => {
  return {
    fadeIn(audio, beginVol = 0, maxVol, interval) {
      console.log(beginVol);
      if (beginVol > maxVol || beginVol === maxVol)
        return clearInterval(interval);
      audio.volume = beginVol;
    },
    typing: new Audio(
      '../dist/audio/medium-pace-Typing-on-mechanical-keyboard-1-www.FesliyanStudios.com.mp3'
    ),
    alert: new Audio(
      '../dist/audio/zapsplat_emergency_alarm_beeps_low_pitched_warning_danger_69057.mp3'
    ),
  };
})();

export default audio;
