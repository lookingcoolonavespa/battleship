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

        if (opp === 'cpu') playerTwo.gameboard.placeShipsRandom();
        newGame.playerOne = playerOne;
        newGame.playerTwo = playerTwo;
        const turn = newGame.playerOne;
        newGame.state = { turn };
        newGame.opp = opp;

        return newGame;
      }
      return newGame;
    },

    onBoardClick(game, coord) {
      const currentTurn = game.state.turn;
      const opposingTurn =
        game.state.turn === game.playerOne ? game.playerTwo : game.playerOne;
      const oppGameboardDiv = opposingTurn.gameboard.div;

      handlePlayerTurn();
      if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 5000);

      function handlePlayerTurn() {
        oppGameboardDiv.style.pointerEvents = 'none';
        runMissleSeq(currentTurn, opposingTurn.gameboard);
        game.state.turn = opposingTurn;
      }

      function handleCpuTurn() {
        runMissleSeq(game.state.turn, game.playerOne.gameboard);
        oppGameboardDiv.style.pointerEvents = 'all';
        game.state.turn = game.playerOne;
      }

      function runMissleSeq(currentTurn, oppGameboard) {
        game.state.turn === game.playerTwo && game.opp === 'cpu'
          ? display('missile incoming')
          : display('sending missile');
        const radarLine = oppGameboard.div.querySelector('li');
        radarLine.className = 'radar-line';
        const { result, coordIndex } = currentTurn.actions.attack(
          opposingTurn.gameboard,
          coord
        );
        setTimeout(() => {
          result === 'hit'
            ? onHit(coordIndex)
            : result === 'miss'
            ? onMiss(coordIndex)
            : onSunk(coordIndex);
          display(result);
          radarLine.className = '';
        }, 2000);
      }

      function onHit(coordIndex) {
        const gridBox =
          game.state.turn.gameboard.div.querySelectorAll('.grid-box')[
            coordIndex
          ];
        gridBox.classList.add('grid-box-hit');
      }
      function onMiss(coordIndex) {
        console.log(
          game.state.turn.gameboard.div.querySelectorAll('.grid-box')[0]
        );
        const gridBox =
          game.state.turn.gameboard.div.querySelectorAll('.grid-box')[
            coordIndex
          ];
        gridBox.classList.add('grid-box-miss');
      }
      function onSunk(coordIndex) {}
    },
  };
})();

export default gameplay;
