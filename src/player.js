const Player = () => {
  // if player === cpu, needs to be able to make moves
  // cpu shouldn't be selecting illegal moves
  // cpu should try adjacent coordinates if their moves hits
  return {
    attack(gameboard, coord) {
      gameboard.receiveAttack(coord);
    },
  };
};

const CPU = () => {
  return {
    attack(gameboard) {
      let coord = generateRandomCoordinates();
      if (gameboard.allShots.length === 0) {
        gameboard.receiveAttack(coord);
        return coord;
      }
      while (
        gameboard.allShots.some(
          (illegalMove) =>
            illegalMove[0] === coord[0] && illegalMove[1] === coord[1]
        )
      ) {
        coord = generateRandomCoordinates();
      }
      gameboard.receiveAttack(coord);
      return coord;

      function generateRandomCoordinates() {
        const coordX = Math.floor(Math.random() * 8 + 1);
        const coordY = Math.floor(Math.random() * 8 + 1);
        return [coordX, coordY];
      }
    },
  };
};

export { Player, CPU };
