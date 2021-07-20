import Gameboard from './gameboard.js';
import { Player, CPU } from './player.js';

const game = (() => {
  // needs to guide user to starting game
  // user selects opponent: another player or cpu
  // once user makes selection, create gameboards and player objs
  // where the eventlisteners belong

  return {
    startNewGame(name) {
      const newGame = [];
      const playerObj = {
        actions: Player(),
        gameboard: Gameboard(),
      };
      const cpuObj = {
        actions: CPU(),
        gameboard: Gameboard(),
      };
      newGame.push(playerObj);
      newGame.push(cpuObj);
      return newGame;
    },

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
  };
})();

const gameSections = document.querySelectorAll('.game-section');
gameSections.forEach((section) => game.generatePlayableGameboard(section));
