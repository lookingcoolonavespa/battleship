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
  return {
    attack(gameboard) {
      const availableShots = getAvailableShots();

      const detectedShipCoords = getDetectedShipCoords();
      if (detectedShipCoords.length > 0)
        return gameboard.receiveAttack(
          getCoordOnSuccessiveHit(detectedShipCoords)
        );

      const cordOnFirstHit = getCoordOnFirstHit();
      if (cordOnFirstHit) return gameboard.receiveAttack(getCoordOnFirstHit());

      return gameboard.receiveAttack(getRandomCoord());

      // helper functions
      function getAvailableShots() {
        const allCoords = gameboard.board.map((obj) => obj.coord);
        return allCoords.filter((coord) =>
          gameboard.allShots.every(
            (shot) => shot[0] !== coord[0] || shot[1] !== coord[1]
          )
        );
      }

      function getRandomCoord() {
        return availableShots[
          Math.floor(Math.random() * availableShots.length)
        ];
      }

      function getCoordOnFirstHit() {
        const hitShip = gameboard.ships.find(
          (ship) => ship.sunk === false && ship.whereHit.length > 0
        );

        if (!hitShip) return;
        const hitCoord = hitShip.whereHit[0];

        return getCoordToTryNext(hitCoord, 'left', 'right', 'up', 'down');
      }

      function getDetectedShipCoords() {
        const hitShots = gameboard.allShots.filter((coord) =>
          gameboard.missedShots.every(
            (shot) => shot[0] !== coord[0] || shot[1] !== coord[1]
          )
        );
        const sunkShipCoords = gameboard.ships
          .filter((ship) => ship.sunk === true)
          .flatMap((ship) => ship.coords);

        const noSunkShots = hitShots.filter((coord) =>
          sunkShipCoords.every(
            (sunkCoord) =>
              sunkCoord[0] !== coord[0] || sunkCoord[1] !== coord[1]
          )
        );
        // need to find adjacent hit shots
        const detectedShipCoords = noSunkShots.filter(
          (shot, index, thisArr) =>
            thisArr.some(
              (coord) => shot[0] + 1 === coord[0] && shot[1] === coord[1]
            ) ||
            thisArr.some(
              (coord) => shot[0] - 1 === coord[0] && shot[1] === coord[1]
            ) ||
            thisArr.some(
              (coord) => shot[0] === coord[0] && shot[1] + 1 === coord[1]
            ) ||
            thisArr.some(
              (coord) => shot[0] === coord[0] && shot[1] - 1 === coord[1]
            )
        );

        return detectedShipCoords.reverse(); // need to reverse so last hit shot is [0]
      }

      function getCoordOnSuccessiveHit(detectedShipCoords) {
        let isAxisX = detectedShipCoords[0][1] === detectedShipCoords[1][1];
        if (
          detectedShipCoords.length >= 5 &&
          detectedShipCoords.every(
            (coord, index, thisArr) =>
              thisArr.every((shot) => shot[0] === coord[0]) ||
              thisArr.every((shot) => shot[1] === coord[1])
          )
        )
          isAxisX = !isAxisX; // means all ships have been hit once along the same axis
        let coordToTryNext;
        while (coordToTryNext === undefined) {
          switch (isAxisX) {
            case true: {
              coordToTryNext = getCoordToTryNext(
                detectedShipCoords[0],
                'left',
                'right'
              );
              if (coordToTryNext === undefined)
                // need to go back to original hit coord after missing
                coordToTryNext = getCoordToTryNext(
                  detectedShipCoords[detectedShipCoords.length - 1],
                  'left',
                  'right'
                );
              if (coordToTryNext === undefined) isAxisX = !isAxisX; // means detectedShipCoords show adjacent ships
              break;
            }
            case false: {
              coordToTryNext = getCoordToTryNext(
                detectedShipCoords[0],
                'up',
                'down'
              );
              if (coordToTryNext === undefined)
                coordToTryNext = getCoordToTryNext(
                  detectedShipCoords[detectedShipCoords.length - 1],
                  'up',
                  'down'
                );
              if (coordToTryNext === undefined) isAxisX = !isAxisX;
              break;
            }
          }
        }
        return coordToTryNext;
      }

      function getCoordToTryNext(hitCoord, ...directions) {
        const allDirectionCoords = {
          left: replaceVal(hitCoord, 0, hitCoord[0] - 1),
          right: replaceVal(hitCoord, 0, hitCoord[0] + 1),
          up: replaceVal(hitCoord, 1, hitCoord[1] - 1),
          down: replaceVal(hitCoord, 1, hitCoord[1] + 1),
        };

        const coordsToTryNext = Object.keys(allDirectionCoords)
          .filter((direction) => directions.includes(direction))
          .map((direction) => allDirectionCoords[direction])
          .filter((coord) =>
            availableShots.some(
              (shot) => shot[0] === coord[0] && shot[1] === coord[1]
            )
          );
        return coordsToTryNext[
          Math.floor(Math.random() * coordsToTryNext.length)
        ];

        function replaceVal(arr, index, val) {
          const copy = arr.slice(0);
          copy[index] = val;
          return copy;
        }
      }
    },
  };
};

export { Player, CPU };
