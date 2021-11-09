const shipFactory = require('./ship.js');
const arrayEquals = require('./utility.js');
// you would normally have a few of your own gameboard, and have a blank
// gameboard for which you see the moves and hits you've made against the player

const Player = (pName, gameboard) => {

  const getPlayerName = () => pName;

  const getDir = (num) => {
    switch (num) {
      case 0:
        return 'N';
        break;
      case 1:
        return 'E';
        break;
      case 2:
        return 'S';
        break;
      case 3:
        return 'W';
        break;
      default:
        throw Error('Error, getDir was passed a number not in the range 0-3...');
    }
  }

  // done in the beginning automatically for ai
  // we'll use ship sizes of 5, 4, 3, 3, 2
  // creates a randomized gameboard for ai
  const aiSetGameboard = () => {
    let shipSizes = [5, 4, 3, 3, 2];
    let randX, randY, randDir, dir, outcome;
    for (let size of shipSizes) {
      // set a ship on the board with size size
      // location and direction both randomized. If illegal, re randomize 
      // and try again
      while (outcome !== 0) {
        randX = getRandomInt(10);
        randY = getRandomInt(10);
        randDir = getRandomInt(4);
        dir = getDir(randDir);
        // If setShip fails, try again
        try {
          outcome = gameboard.setShip(randX, randY, dir, shipFactory, size);
        } catch (Error) {
          console.log('Error caught, but going past it...');
        }
      }
      outcome = 1;  // boolean flags would look nicer, but tests were written
      // with 0 in mind as successful outcome
    }
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max); // + 1 if you want no 0
  } 

  // This is for stupid ai. affects opposing gameboard
  const aiAttack = (enemyGameboard) => {
    let randX, randY, outcome;
    while (outcome !== 0) {
      randX = getRandomInt(10);
      randY = getRandomInt(10);
      try {
        outcome = enemyGameboard.receiveAttack(randX, randY);
      } catch (Error) {
        console.log(Error);
      }
    }
    enemyGameboard.getGameboard();
    // outcome = 1;  // boolean flags would look nicer, but tests were written
    // // with 0 in mind as successful outcome
    return true;
  }

  // this is for you as player (and potentially enemy players)
  const playerAttack = (enemyGameboard, X, Y) => {
    try {
      enemyGameboard.receiveAttack(X, Y);
    } catch (Error) {
      console.log(Error);
      return false;
    }
    return true;
  }

  const getPlayerGameboard = () => gameboard;

  return { aiSetGameboard, getPlayerGameboard, aiAttack, playerAttack, getPlayerName, pName, gameboard   };
}

module.exports = Player;