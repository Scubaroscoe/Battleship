const arrayEquals = require('./utility.js');

const shipFactory = (length) => {
  let sunk = false;
  let hull = 'O'.repeat(length).split('');
  let hullCoords = [];
  let hullMapping = {};

  const hit = (num) => {
    if ((num >= length) || (num < 0)) {
      throw Error('Hit is outside of bounds of ship length');
    }

    hull[num] = 'X';
    console.log(`Hull position: ${num} has been hit`)
    return 0;
  }

  const getHitIndex = (coord) => {
    // parse through the hull mapping. find the position with the coord
    // return that position
    let hullMap = hullMapping;
    for (const property in hullMap) {
      if (arrayEquals(hullMap[property], coord)) {
        return property;
      }
    }
    throw Error('Something is wrong. There is no matching coordinate for this ship');
  }

  const isSunk = () => {
    // should be a function that calculates it based on their length and whether 
    // all of their positions are hit
    // sunk = true;
    sunk = hull.every((pos) => pos === 'X');
    return sunk;
  }

  const setHullCoords = (X, Y) => {
    hullCoords.push([X, Y]);
    for (let i = 0; i < length; i++) {
      if (!hullMapping[i]) {
        hullMapping[i] = hullCoords[i];
        break;
      }
    }
  }

  const getHullCoords = () => hullCoords;

  const getLength = () => length;

  const getHull = () => hull;
  
  return {
    hit, isSunk, getLength, getHull, getHullCoords, setHullCoords,
    getHitIndex, length, sunk, hull, hullCoords, hullMapping
  };
}

module.exports = shipFactory;