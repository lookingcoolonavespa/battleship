const Ship = ((length) => {
  return {
    length,
    hit() {
      // takes a number and marks that position as 'hit'
    },
    isSunk() {
      // calculates whether all positions have been 'hit'
    },
  };
})();

const Gameboard = (() => {
  // should keep track of all missed attacks so they can be displayed

  // should be able to report if all ships have been sunk

  return {
    receiveAttack(coordX, coordY) {
      // takes coordinates, determines whether attack hit a ship,
      // sends hit function to correct ship if it hits
      // records coordinates of the missedd shot
    },
  };
})();

const Player = (() => {
  // if computer, need to make random move
  return {};
})();
