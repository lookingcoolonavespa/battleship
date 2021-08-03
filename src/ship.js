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
      this.sunk = isEqual(this.whereHit, this.coords);
      return this.sunk;

      function isEqual(arrOne, arrTwo) {
        if (arrOne.length !== arrTwo.length) return false;
        return arrOne.every((val, index) => val === arrTwo[index]);
      }
    },
  };
};

export default Ship;
