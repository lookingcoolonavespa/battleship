import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';

const gameplay = (() => {
  document.documentElement.innerHTML =
    '<html lang="en"> <head> </head> <body> <section id="start" class="centered hidden"> <h1 class="title story-text type-anime">Battleship</h1> <div class="btn-ctn centered"> <button class="btn text-btn start-btn">Start game</button> <button class="btn text-btn quick-start-btn">Quick start game</button> <button class="btn sound-btn"><i class="fas fa-volume-up"></i></button> </div> <span class="story-text story-text-1 hidden"> Hostile ships have been spotted 200 miles off the coastline</span > <span class="story-text story-text-2 hidden">Your mission is simple</span> <span class="story-text story-text-3 hidden">Eliminate the threat</span> </section> <section id="alert" class="alert-anime hidden centered"> <h2 class="alert-title">WARNING</h2> <p>Enemy ships approaching</p> <div class="btn-ctn centered"> <button class="btn sound-btn"><i class="fas fa-volume-up"></i></button> </div> </section> <section id="command-center" class="centered hidden"> <span class="instructions"> Admiral, place your <span id="ship-name" class="story-text type-anime"></span> </span> <button class="btn text-btn axis-btn"> Axis : <span id="axis-text">X</span> </button> </section> <section id="gameplay" class=""> <h3 class="title">Battleship</h3> <div class="instructions">Hit confirmed</div> <div class="game"> <div class="game-section game-section-player"> <h4 class="gameboard-label">Friendly Waters</h4> </div> <div class="game-section game-section-cpu"> <h4 class="gameboard-label">Enemy Waters</h4> </div> </div> </section> </body> </html>';
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
      handlePlayerTurn();
      if (game.opp === 'cpu') return handleCpuTurn();

      // handlePlayerTurn().then(() => {
      //   if (game.opp === 'cpu') return setTimeout(handleCpuTurn, 2000);
      // });

      function handlePlayerTurn() {
        oppGameboardDiv.style.pointerEvents = 'none';
        runMissleSeq(currentTurn, opposingTurn.gameboard);
        game.state.turn = opposingTurn;
        opposingTurn = game.playerOne;

        // return new Promise((resolve) => {
        //   runMissleSeq(currentTurn, opposingTurn.gameboard).then(() => {
        //     game.state.turn = opposingTurn;
        //     opposingTurn = game.playerOne;
        //     resolve();
        //   });
        // });
      }

      function handleCpuTurn() {
        runMissleSeq(game.state.turn, game.playerOne.gameboard);
        oppGameboardDiv.style.pointerEvents = 'all';
        game.state.turn = game.playerOne;
        opposingTurn = game.playerTwo;
      }

      // function handleCpuTurn() {
      //   runMissleSeq(game.state.turn, game.playerOne.gameboard).then(() => {
      //     oppGameboardDiv.style.pointerEvents = 'all';
      //     game.state.turn = game.playerOne;
      //     opposingTurn = game.playerTwo;
      //   });
      // }

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
        result === 'hit'
          ? onHit(coordIndex)
          : result === 'miss'
          ? onMiss(coordIndex)
          : onSunk(coordIndex, opposingTurn.gameboard);
        display(result);
        radarLine.className = '';
      }
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     result === 'hit'
      //       ? onHit(coordIndex)
      //       : result === 'miss'
      //       ? onMiss(coordIndex)
      //       : onSunk(coordIndex, opposingTurn.gameboard);
      //     display(result);
      //     radarLine.className = '';
      //     resolve();
      //   }, 2000);
      // });

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
          gridBoxes[index].classList.contains('grid-box-hit')
            ? gridBoxes[index].classList.replace(
                'grid-box-hit',
                'grid-box-sunk'
              )
            : gridBoxes[index].classList.add('grid-box-sunk')
        );
      }
    },
  };
})();

export default gameplay;
