import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';
import animate from './animate.js';
import endgame from './endGame.js';

const gameplay = (() => {
  const ctn = document.getElementById('gameplay');
  const gameInfo = ctn.querySelector('.instructions');
  const playerSection = ctn.querySelector('.game-section-player');
  const cpuSection = ctn.querySelector('.game-section-cpu');

  function display(str, duration = 800) {
    gameInfo.textContent = str;
    return animate.typing(gameInfo, duration);
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
        console.log(playerTwo.gameboard.ships);
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
        if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 1500);
      });

      function handlePlayerTurn() {
        oppGameboardDiv.style.pointerEvents = 'none';

        return new Promise((resolve) => {
          runMissleSeq(currentTurn, opposingTurn.gameboard).then(() => {
            if (opposingTurn.gameboard.checkIfAllShipsSunk()) return endGame();
            game.state.turn = opposingTurn;
            opposingTurn = game.playerOne;
            resolve();
          });
        });
      }

      function handleCpuTurn() {
        runMissleSeq(game.state.turn, game.playerOne.gameboard).then(() => {
          if (game.playerOne.gameboard.checkIfAllShipsSunk()) return endGame();
          display('Awaiting orders');
          oppGameboardDiv.style.pointerEvents = 'all';
          game.state.turn = game.playerOne;
          opposingTurn = game.playerTwo;
        });
      }

      function runMissleSeq(currentTurn, oppGameboard) {
        const launchStr =
          game.state.turn === game.playerTwo && game.opp === 'cpu'
            ? 'Enemy missile incoming'
            : 'Launching missile';

        const radarLine = oppGameboard.div.querySelector('li');
        animate.fadeIn(radarLine, 1);

        return display(launchStr).then(() => {
          return new Promise((resolve) => {
            const { result, coordIndex } = currentTurn.actions.attack(
              opposingTurn.gameboard,
              coord
            );

            displayResult(result, coordIndex).then(() => {
              switch (result) {
                case 'hit':
                  onHit();
                  break;
                case 'miss':
                  onMiss();
                  break;
                case 'sunk':
                  onSunk();
                  break;
              }
              animate.fadeOut(radarLine, 1);
              resolve();
            });

            function displayResult(result, coordIndex) {
              if (game.state.turn === game.playerTwo && game.opp === 'cpu') {
                switch (result) {
                  case 'hit': {
                    const hitShip =
                      game.playerOne.gameboard.board[coordIndex].ship;
                    return display(`Our ${hitShip.name} has been hit`);
                  }
                  case 'miss': {
                    return display('No collision');
                  }
                  case 'sunk': {
                    const sunkShip =
                      game.playerOne.gameboard.board[coordIndex].ship;
                    return display(
                      `Mayday Mayday. Our ${sunkShip.name} has been taken out. Our ${sunkShip.name} has been taken out.`
                    );
                  }
                }
              }

              if (game.state.turn === game.playerOne && game.opp === 'cpu') {
                switch (result) {
                  case 'hit': {
                    return display('Hit confirmed');
                  }
                  case 'miss': {
                    return display('No collision');
                  }
                  case 'sunk': {
                    const sunkShip =
                      game.playerTwo.gameboard.board[coordIndex].ship;
                    return display(
                      `Report incoming...enemy ${sunkShip.name} has been taken out `
                    );
                  }
                }
              }
            }
            function onHit() {
              const gridBox =
                opposingTurn.gameboard.div.querySelectorAll('.grid-box')[
                  coordIndex
                ];
              gridBox.classList.add('grid-box-hit');
            }
            function onMiss() {
              const gridBox =
                opposingTurn.gameboard.div.querySelectorAll('.grid-box')[
                  coordIndex
                ];
              gridBox.classList.add('grid-box-miss');
            }
            function onSunk() {
              const sunkShip = oppGameboard.board[coordIndex].ship;
              const sunkShipCoords = sunkShip.whereHit;
              const sunkShipIndexes = [];
              sunkShipCoords.forEach((coord) => {
                const [coordX, coordY] = coord;
                sunkShipIndexes.push(
                  oppGameboard.board.findIndex(
                    (obj) => coordX === obj.coord[0] && coordY === obj.coord[1]
                  )
                );
              });

              const gridBoxes = oppGameboard.div.querySelectorAll('.grid-box');
              sunkShipIndexes.forEach((index) =>
                gridBoxes[index].classList.contains('grid-box-hit')
                  ? gridBoxes[index].classList.replace(
                      'grid-box-hit',
                      'grid-box-sunk'
                    )
                  : gridBoxes[index].classList.add('grid-box-sunk')
              );
            }
          });
        });
      }

      function endGame() {
        const endGameStr =
          game.state.turn === game.playerTwo && game.opp === 'cpu'
            ? `All ships down. All ships are down. Enemy ships are closing in on position. I repeat enemy ships are closing in. `
            : 'Last hostile ship taken out. Victory';

        display(endGameStr)
          .then(() => {
            return animate.fadeOut(ctn);
          })
          .then(() => {
            animate.fadeIn(endgame.ctn);
            const endgameStr =
              game.state.turn === game.playerTwo && game.opp === 'cpu'
                ? ''
                : '';
            endgame.display(endgameStr);
            animate.fadeIn(endgame.newGameBtn);
          });
      }
    },
  };
})();

export default gameplay;
