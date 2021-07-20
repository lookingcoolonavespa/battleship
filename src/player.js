const Player = () => {
  // if player === cpu, needs to be able to make moves
  // cpu shouldn't be selecting illegal moves
  // cpu should try adjacent coordinates if their moves hits
  return {
    attack(coordX, coordY, gameboard) {
      gameboard.receiveAttack(coordX, coordY);
    },
  };
};

const CPU = () => {
  return {
    attack(gameboard) {
      let coord = generateRandomCoordinates();
      while (
        gameboard.allShots.some(
          (missedShot) =>
            missedShot[0] === coord[0] && missedShot[1] === coord[1]
        )
      ) {
        coord = generateRandomCoordinates();
      }
      const [coordX, coordY] = coord;
      gameboard.receiveAttack(coordX, coordY);
      return coord;

      function generateRandomCoordinates() {
        const coordX = Math.floor(Math.random() * 10 + 1);
        const coordY = Math.floor(Math.random() * 10 + 1);
        return [coordX, coordY];
      }
    },
  };
};

export { Player, CPU };
