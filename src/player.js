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
  function generateCoordsOnHit(hitCoord) {
    const coordsToTryNext = {};
    coordsToTryNext.originalHitCoord = hitCoord;
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
    coordsToTryNext: {},
    attack(gameboard, coord) {
      coord =
        coord ||
        (this.coordsToTryNext.originalHitCoord
          ? tryNextCoord.call(this)
          : generateRandomCoordinates());

      if (gameboard.allShots.length === 0) {
        // don't need to perform illegal move search on first turn
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
          // looking for moves that shoot off the board
          (coordObj) =>
            coordObj.coord[0] === coord[0] && coordObj.coord[1] === coord[1]
        )
      ) {
        coord = this.coordsToTryNext.originalHitCoord
          ? tryNextCoord.call(this)
          : generateRandomCoordinates();
      }

      const result = gameboard.receiveAttack(coord);
      process.call(this, result);
      return result;

      function process(result) {
        if (result.result === 'sunk')
          return (this.coordsToTryNext.originalHitCoord = null);

        if (result.result === 'hit' && this.coordsToTryNext.originalHitCoord) {
          // if successive hit
          const direction = Object.keys(this.coordsToTryNext)
            .filter((key) => this.coordsToTryNext[key] !== null)
            .find(
              (key) =>
                this.coordsToTryNext[key][0] === result.coord[0] &&
                this.coordsToTryNext[key][1] === result.coord[1]
            ); // look for which direction the ship is pointing towards
          this.coordsToTryNext[direction] = generateCoordsInDirection(
            result.coord,
            direction
          );

          for (const key in this.coordsToTryNext) {
            if (key !== direction && key !== 'originalHitCoord')
              this.coordsToTryNext[key] = null;
            // remove other directions from possible pool
          }

          return;
        }

        if (
          // looking for miss after successive hits, means you need to shoot in other direction
          result.result === 'miss' &&
          this.coordsToTryNext.originalHitCoord &&
          Object.keys(this.coordsToTryNext).find(
            (key) => this.coordsToTryNext[key] === null
          )
        ) {
          const direction = Object.keys(this.coordsToTryNext).find(
            (key) =>
              this.coordsToTryNext[key] !== null && key !== 'originalHitCoord'
          );

          let oppositeDirection;
          switch (direction) {
            case 'left':
              oppositeDirection = 'right';
              break;
            case 'right':
              oppositeDirection = 'left';
              break;
            case 'up':
              oppositeDirection = 'down';
              break;
            case 'down':
              oppositeDirection = 'up';
          }

          return (this.coordsToTryNext[oppositeDirection] =
            generateCoordsInDirection(
              this.coordsToTryNext.originalHitCoord,
              oppositeDirection
            ));
        }

        if (result.result === 'hit')
          return (this.coordsToTryNext = generateCoordsOnHit(coord));
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
