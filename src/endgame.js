const endgame = (() => {
  const ctn = document.getElementById('endgame');
  const text = ctn.querySelector('.story-text');
  const newGameBtn = ctn.querySelector('.text-btn');

  return {
    newGameBtn,
  };
})();

export default endgame;
