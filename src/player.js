const Player = () => {
  // if player === cpu, needs to be able to make moves
  // cpu shouldn't be selecting illegal moves
  // cpu should try adjacent coordinates if their moves hits
  return {
    attack(gameboard, coord) {
      return gameboard.receiveAttack(coord);
    },
  };
};

const CPU = () => {
  const coordsToTryNext = {};
  function generateCoordsOnHit(hitCoord) {
    const coordsToTryNext = {};
    coordsToTryNext.hitCoord = hitCoord;
    coordsToTryNext.left = replaceVal(hitCoord, 0, hitCoord[0] - 1);
    coordsToTryNext.right = replaceVal(hitCoord, 0, hitCoord[0] + 1);
    coordsToTryNext.up = replaceVal(hitCoord, 1, hitCoord[1] - 1);
    coordsToTryNext.down = replaceVal(hitCoord, 1, hitCoord[1] + 1);
    return coordsToTryNext;
  }
  function generateCoordsInDirection(coord, direction) {
    let dirCoord;

    switch (direction) {
      case 'up': {
        dirCoord = replaceVal(coord, 1, coord[1] - 1);
        break;
      }
      case 'down': {
        dirCoord = replaceVal(coord, 1, coord[1] + 1);
        break;
      }
      case 'left': {
        dirCoord = replaceVal(coord, 0, coord[0] - 1);
        break;
      }
      case 'right': {
        dirCoord = replaceVal(coord, 0, coord[0] + 1);
        break;
      }
    }

    return dirCoord;
  }

  function replaceVal(hitCoord, index, val) {
    const copy = hitCoord.slice(0);
    copy[index] = val;
    return copy;
  }

  return {
    coordsToTryNext,
    attack(gameboard, coord) {
      coord =
        coord ||
        (this.coordsToTryNext.hitCoord
          ? tryNextCoord.call(this)
          : generateRandomCoordinates());

      if (gameboard.allShots.length === 0) {
        const result = gameboard.receiveAttack(coord);
        process.call(this, result);
        return result;
      }

      while (
        gameboard.allShots.some(
          (illegalMove) =>
            illegalMove[0] === coord[0] && illegalMove[1] === coord[1]
        ) ||
        !gameboard.board.find(
          (coordObj) =>
            coordObj.coord[0] === coord[0] && coordObj.coord[1] === coord[1]
        )
      ) {
        coord = this.coordsToTryNext.hitCoord
          ? tryNextCoord.call(this)
          : generateRandomCoordinates();
      }

      const result = gameboard.receiveAttack(coord);
      process.call(this, result);
      return result;

      function process(result) {
        if (result.result === 'sunk') this.coordsToTryNext.hitCoord = null;
        if (result.result === 'hit' && this.coordsToTryNext.hitCoord) {
          const direction = Object.keys(this.coordsToTryNext)
            .filter((key) => this.coordsToTryNext[key] !== null)
            .find(
              (key) =>
                this.coordsToTryNext[key][0] === result.coord[0] &&
                this.coordsToTryNext[key][1] === result.coord[1]
            );
          this.coordsToTryNext[direction] = generateCoordsInDirection(
            result.coord,
            direction
          );

          for (const key in this.coordsToTryNext) {
            if (key !== direction && key !== 'hitCoord')
              this.coordsToTryNext[key] = null;
          }

          return;
        }

        if (result.result === 'hit')
          this.coordsToTryNext = generateCoordsOnHit(coord);
      }

      function tryNextCoord() {
        const keys = Object.keys(this.coordsToTryNext);
        let rdm = Math.floor(Math.random() * keys.length);
        while (this.coordsToTryNext[keys[rdm]] === null)
          rdm = Math.floor(Math.random() * keys.length);
        return this.coordsToTryNext[keys[rdm]];
      }
      function generateRandomCoordinates() {
        const coordX = Math.floor(Math.random() * 8 + 1);
        const coordY = Math.floor(Math.random() * 8 + 1);
        return [coordX, coordY];
      }
    },
  };
};

export { Player, CPU };
