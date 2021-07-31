const Ship = (length) => {
  return {
    length,
    sunk: false,
    whereHit: [],
    hit(pos) {
      this.whereHit.push(pos);
    },
    isSunk() {
      this.sunk = this.whereHit.length === this.length;
      return this.sunk;
    },
  };
};

export default Ship;
