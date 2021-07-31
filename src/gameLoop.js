import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';

const gameLoop = (() => {
  const ctn = document.getElementById('gameplay');

  return {
    state: { currentGame: null },
    startNewGame(opp, playerGameboard = Gameboard()) {
      const newGame = {};
      const playerObj = {
        actions: Player(),
        gameboard: playerGameboard,
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
