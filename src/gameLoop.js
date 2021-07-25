import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';
import startSeq from './startSeq.js';

const gameLoop = (() => {
  // needs to guide user to starting game
  // user selects opponent: another player or cpu
  // once user makes selection, create gameboards and player objs
  // where the eventlisteners belong

  return {
    state: { currentGame: null },
    generatePlayableGameboard(ctn) {
      const gameboardDiv = document.createElement('div');
      gameboardDiv.classList.add('gameboard');

      for (let i = 0; i < Math.pow(8, 2); i++) {
        const gridBox = document.createElement('div');
        gridBox.classList.add('grid-box');
        gameboardDiv.appendChild(gridBox);
      }
      ctn.appendChild(gameboardDiv);
    },
    startNewGame(opp) {
      const newGame = {};
      const playerObj = {
        actions: Player(),
        gameboard: Gameboard(),
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
      newGame.playerOne = playerObj;
      newGame.playerTwo = playerTwo;
      const turn = newGame.playerOne;
      newGame.state = { turn };
      newGame.opp = opp;

      return newGame;
    },

    onBoardClick(game, coord) {
      const currentTurn = game.state.turn;
      const opposingTurn =
        game.state.turn === game.playerOne ? game.playerTwo : game.playerOne;

      currentTurn.actions.attack(opposingTurn.gameboard, coord);

      if (game.opp === 'cpu') return handleCpuTurn();
      game.state.turn = opposingTurn;

      function handleCpuTurn() {
        game.playerTwo.actions.attack(currentTurn.gameboard);
      }
    },
  };
})();

export default gameLoop;
