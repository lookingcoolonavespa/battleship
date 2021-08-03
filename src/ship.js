const Ship = (name, length) => {
  return {
    name,
    length,
    sunk: false,
    coords: [],
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
