import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';
import animate from './animate.js';

const gameplay = (() => {
  const ctn = document.getElementById('gameplay');
  const gameInfo = ctn.querySelector('.instructions');
  const playerSection = ctn.querySelector('.game-section-player');
  const cpuSection = ctn.querySelector('.game-section-cpu');

  function display(str) {
    gameInfo.textContent = str;
    animate.typing(gameInfo);
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
        if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 2500);
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
        animate.fadeIn(radarLine, 1);

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
            animate.fadeOut(radarLine, 1);
            resolve();
          }, 2500);
        });
      }
      function onHit(coordIndex) {
        game.state.turn === game.playerTwo && game.opp === 'cpu'
          ? display(
              `Our ${game.playerOne.gameboard.board[coordIndex].ship.name} has been hit`
            )
          : display('Hit confirmed');

        const gridBox =
          opposingTurn.gameboard.div.querySelectorAll('.grid-box')[coordIndex];
        gridBox.classList.add('grid-box-hit');
      }
      function onMiss(coordIndex) {
        game.state.turn === game.playerTwo && game.opp === 'cpu'
          ? display('Enemy missile missed')
          : display('No collision');

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
          gridBoxes[index].classList.contains('grid-box-hit')
            ? gridBoxes[index].classList.replace(
                'grid-box-hit',
                'grid-box-sunk'
              )
            : gridBoxes[index].classList.add('grid-box-sunk')
        );

        if (gameboard.checkIfAllShipsSunk()) return endGame();

        game.state.turn === game.playerTwo && game.opp === 'cpu'
          ? display(
              `Mayday Mayday. Our ${sunkShip.name} has been taken out. Our ${sunkShip.name} has been taken out.`
            )
          : display(
              `Report incoming...enemy ${sunkShip.name} has been taken out `
            );
      }
      function endGame() {
        game.state.turn === game.playerTwo && game.opp === 'cpu'
          ? display(
              `All ships down. All ships are down. Enemy ships are closing in on position. I repeat enemy ships are closing in. `
            )
          : display('Last hostile ship taken out. Victory');

        const gameEnded = document.createElement('div');
        gameEnded.classList.add('game-ended');
        ctn.appendChild(gameEnded);
      }
    },
  };
})();

export default gameplay;
