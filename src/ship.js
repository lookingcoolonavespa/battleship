const Ship = (length) => {
  return {
    length,
    sunk: false,
    whereHit: [],
    hit(pos) {
      // takes a number and marks that position as 'hit'
      this.whereHit.push(pos);
    },
    isSunk() {
      // calculates whether all positions have been 'hit'
      if (this.whereHit.length === this.length) this.sunk = true;
      return this.sunk;
    },
  };
};

export { Ship };
export default Ship;
