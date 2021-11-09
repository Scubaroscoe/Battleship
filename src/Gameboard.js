const arrayEquals = require('./utility.js');


const Gameboard = () => {
  // make a 10x10 gameboard
  let gameboard = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '.'));
  let navy = [];
  let attacksMade = [];
  let hitsMade = [];
  let missesMade = [];

  const getGameboard = () => {
    return gameboard;
  }
  // have ability to place ships at coordinates

  const legalDirection = (X, Y, dir, ship) => {
    let len = ship.getLength();
    if ((dir === 'N') && (Y - len < 0)) {
      return false;
    } else if ((dir === 'S') && (Y + len >= 10)) {
      return false;
    } else if ((dir === 'W') && (X - len < 0)) {
      return false;
    } else if ((dir === 'E') && (X + len >= 10)) {
      return false;
    }
    return true;
  }

  const legalPosition = (X, Y) => {
    if ((X > 9) || (X < 0) || (Y > 9) || (Y < 0)) {
      return false;
    }
    return true;
  }

  // Could've done this in one line of code, but this is easier to read and understand
  const revertSetShip = (arr) => {
    let X, Y;
    for (let i = 0; i < arr.length; i++) {
      X = arr[i][0];
      Y = arr[i][1];
      gameboard[X][Y] = '.';
    }
  }

  // Maybe have an array that accounts for all correctly added ships to the gameboard
  // when they all have sunk status, you know game is over.
  const setShip = (X, Y, dir, shipFactory, length) => {
    let ship = shipFactory(length);
    // check that the coordinates are in bounds
    if (!legalPosition(X, Y)) {
      throw Error('Coordinates given are not within the gameboard');
    }
    if (!legalDirection(X, Y, dir, ship)) {
      throw Error('Direction not possible given coordinates and ship length')
    }
    let hull = ship.getHull();
    // need a sort of temp storage array to be able to go back if ship crosses 
    // another ship. Otherwise we leave pieces of ship on the gameboard
    let tempCoords = [];
    for (let i = 0; i < ship.getLength(); i++) {
      if (legalPosition(X, Y)) {
        if (gameboard[X][Y] === '.') {
          gameboard[X][Y] = hull[i];
          ship.setHullCoords(X, Y);
          tempCoords.push([X, Y]);
        } else {
          console.log(`Bad coords - X: ${X}, Y: ${Y}`);
          // Here before the error we reset the changes to the gameboard
          revertSetShip(tempCoords);
          throw Error('The ship you\'re adding is overlapping upon some previously placed ship');
        }
        switch (dir) {
          case 'N':
            // Y -= 1; // N: actually W
            X -= 1;
            break;
          case 'S':
            // Y += 1; // S: actually E
            X += 1;
            break;
          case 'W':
            // X -= 1; // W: actually N
            Y -= 1;
            break;
          case 'E':
            // X += 1; // E: actually S
            Y += 1;
            break;
        }
      } else {
        revertSetShip(tempCoords);
        throw Error(`Coordinates not legal. X, Y: ${X}, ${Y}`);
      }
    }
    navy.push(ship);
    return 0; // Using this 0 just to see that function completes without errors
    // probably a better way to go about this...
  }

  const receiveAttack = (X, Y) => {
    // check coordinates are legal
    let coord = [X, Y];
    if (!legalPosition(X, Y)) {
      throw Error('This attack is out of bounds');
    }

    // check that they haven't already been called before
    if (attacksMade.some((attack) => arrayEquals(attack, coord))) {
      throw Error('This coordinate has already been targeted');
    }

    // if hit, check if ship is sunk. if so, output to console for now,
    if (gameboard[X][Y] === 'O') {
      // find the specific ship from inside navy
      let fleet = navy;
      let ship;
      for (let i = 0; i < navy.length; i++) {
        let currentShip = fleet[i];
        let currentCoords = currentShip.getHullCoords();

        if (currentCoords.some(shipCoord => arrayEquals(shipCoord, coord))) {
          ship = currentShip;
          break;
        }
      }
      // then set that specific position to hit
      let hitPos = ship.getHitIndex(coord);
      ship.hit(hitPos);
      // update gameboard
      hitsMade.push(coord);
      gameboard[X][Y] = 'X';
      console.log(`Coordinates X: ${String.fromCharCode(('A'.charCodeAt(0) + X))}, Y: ${Y} are a hit!`);
      // then change status of isSunk to true for that ship
      if (ship.isSunk()) console.log('You sunk a battleship!');
    } else {  // if miss
      missesMade.push(coord);
      gameboard[X][Y] = 'A';
      console.log(`Coordinates X: ${String.fromCharCode(('A'.charCodeAt(0) + X))}, Y: ${Y} are a miss.`);
    }

    // whether hit or miss, record the coordinates. probably use tuple for this?
    attacksMade.push(coord);
    return 0;
  }

  // this should be called after every receiveAttack
  const checkGameover = () => {
    return navy.every(ship => ship.isSunk());
  }

  const checkAttack = (arr) => {
    let X = arr[0];
    let Y = arr[1];
    if ((X < 0 || X >= 10) || (Y < 0 || Y >= 10)) {
      throw Error('This attack is out of bounds');
    }
    return true;
  }
    
  const getHitsMade = () => hitsMade;

  const displayMisses = () => {
    console.table(missesMade);
  }

  return {
    setShip, receiveAttack, checkGameover, displayMisses, getGameboard,
    getHitsMade, legalPosition, gameboard, navy, attacksMade, hitsMade,
    missesMade
  };
}

module.exports = Gameboard;