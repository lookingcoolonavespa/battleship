import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';

const gameplay = (() => {
  const ctn = document.getElementById('gameplay');
  const gameInfo = ctn.querySelector('.instructions');
  const playerSection = ctn.querySelector('.game-section-player');
  const cpuSection = ctn.querySelector('.game-section-cpu');

  function display(str) {
    gameInfo.textContent = str;
  }

  return {
    startNewGame(opp, playerOneGameboard = Gameboard()) {
      const newGame = createNewGameObj();

      const { playerOne, playerTwo } = newGame;

      playerSection.appendChild(playerOne.gameboard.div);
      cpuSection.appendChild(playerTwo.gameboard.div);

      function createNewGameObj() {
        const newGame = {};
        const playerOne = {
          actions: Player(),
          gameboard: playerOneGameboard,
        };
        const playerTwo =
          opp === 'cpu'
            ? {
                actions: CPU(),
                gameboard: Gameboard(),
              }
            : {
                actions: Player(),
                gameboard: Gameboard(),
              };
        newGame.playerOne = playerOne;
        newGame.playerTwo = playerTwo;
        const turn = newGame.playerOne;
        newGame.state = { turn };
        newGame.opp = opp;

        return newGame;
      }
      return newGame;
    },

    onBoardClick(game, coord, gridBox) {
      const currentTurn = game.state.turn;
      const opposingTurn =
        game.state.turn === game.playerOne ? game.playerTwo : game.playerOne;

      handlePlayerTurn();
      if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 5000);

      function handlePlayerTurn() {
        game.playerTwo.gameboard.div.style.pointerEvents = 'none';
        display('sending missle');
        const result = currentTurn.actions.attack(
          opposingTurn.gameboard,
          coord
        );
        result === 'hit' ? onHit() : onMiss();
        setTimeout(() => display(result), 2000);
      }

      function handleCpuTurn() {
        display('missle incoming');
        const result = game.playerTwo.actions.attack(currentTurn.gameboard);
        display(result);
        game.playerTwo.gameboard.div.style.pointerEvents = 'all';
      }

      function onHit() {
        gridBox.classList.add('grid-box-hit');
      }
      function onMiss() {
        gridBox.classList.add('grid-box-miss');
      }
    },
  };
})();

export default gameplay;
