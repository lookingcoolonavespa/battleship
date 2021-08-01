import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';
import Ship from './ship.js';

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

      return newGame;

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
    },

    onBoardClick(game, coord) {
      const currentTurn = game.state.turn;
      let opposingTurn =
        game.state.turn === game.playerOne ? game.playerTwo : game.playerOne;
      const oppGameboardDiv = opposingTurn.gameboard.div;

      handlePlayerTurn().then(() => {
        if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 2000);
      });

      function handlePlayerTurn() {
        oppGameboardDiv.style.pointerEvents = 'none';
        return new Promise((resolve) => {
          runMissleSeq(currentTurn, opposingTurn.gameboard).then(() => {
            game.state.turn = opposingTurn;
            opposingTurn = game.playerOne;
            resolve();
          });
        });
      }

      function handleCpuTurn() {
        runMissleSeq(game.state.turn, game.playerOne.gameboard).then(() => {
          oppGameboardDiv.style.pointerEvents = 'all';
          game.state.turn = game.playerOne;
          opposingTurn = game.playerTwo;
        });
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
        return new Promise((resolve) => {
          setTimeout(() => {
            result === 'hit'
              ? onHit(coordIndex)
              : result === 'miss'
              ? onMiss(coordIndex)
              : onSunk(coordIndex, opposingTurn.gameboard);
            display(result);
            radarLine.className = '';
            resolve();
          }, 2000);
        });
      }

      function onHit(coordIndex) {
        const gridBox =
          opposingTurn.gameboard.div.querySelectorAll('.grid-box')[coordIndex];
        gridBox.classList.add('grid-box-hit');
      }
      function onMiss(coordIndex) {
        const gridBox =
          opposingTurn.gameboard.div.querySelectorAll('.grid-box')[coordIndex];
        gridBox.classList.add('grid-box-miss');
      }
      function onSunk(coordIndex, gameboard) {
        const sunkShip = gameboard.board[coordIndex].ship;
        const sunkShipCoords = sunkShip.whereHit;
        const sunkShipIndexes = [];
        sunkShipCoords.forEach((coord) => {
          const [coordX, coordY] = coord;
          sunkShipIndexes.push(
            gameboard.board.findIndex(
              (obj) => coordX === obj.coord[0] && coordY === obj.coord[1]
            )
          );
        });

        const gridBoxes = gameboard.div.querySelectorAll('.grid-box');
        sunkShipIndexes.forEach((index) =>
          gridBoxes[index].classList.replace('grid-box-hit', 'grid-box-sunk')
        );
      }
    },
  };
})();

export default gameplay;
