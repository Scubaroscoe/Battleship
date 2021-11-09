import './reset.css';
import './style.css';
import Player from './Player.js';
import Gameboard from './Gameboard.js';


// Some basic start of page initialization
console.log('First line from index.js. Testing...');
// console.log(`charcode of A is: ${String.fromCharCode(('A'.charCodeAt(0) + 1))}`)
const body = document.querySelector('body');
const pageTitle = document.createElement('h1');
pageTitle.textContent = "Battleship";
let headerDiv = document.createElement('div');
headerDiv.id = "ai-div";

let midDiv = document.createElement('div');
midDiv.id = "player-div";

body.append(pageTitle, headerDiv, midDiv);

// Setup a new game by creating players and gameboards.
const npcGameboard = Gameboard();
const npc = Player('npc Player', npcGameboard);

const playerGameboard = Gameboard();
const player = Player('Player', playerGameboard);

console.log(`Name of the player is: ${player.getPlayerName()}`);
console.log(`Name of the npc is: ${npc.getPlayerName()}`);

// for now populate each gameboard with predetermined coordinates.
npc.aiSetGameboard();
// console.log('test2')
// console.log(`npc gameboard looks like: ${npc.gameboard}`);
// TODO: implement playerSetGameboard method in Player.
player.aiSetGameboard();
// console.log('test3')
// console.log(`player gameboard looks like: ${player.gameboard}`);

let npcTable = makeTable(npc.gameboard, false);
let npch2 = document.createElement('h2');
npch2.textContent = 'NPC Gameboard';
headerDiv.append(npch2, npcTable);

let playerTable = makeTable(player.gameboard, true);
let playerh2 = document.createElement('h2');
playerh2.textContent = 'Player Gameboard';
midDiv.append(playerh2, playerTable);

let playerTurn = true;

// playerTurn = getTurn(player, npc, playerTurn);

console.log('after player turn');

// Player needs to be able to see their own board, and the board that shows their 
// attacks against the AI

function makeTable(gameboard, playerTable=true) {
  const table = document.createElement('table');
  if (playerTable) table.classList.toggle("playerTable");
  // Not using thead because both left and top are axes, so it would look weird
  // to have one head at the top only like that
  // The following sets up the top of the table
  const theadrow = document.createElement('tr');
  const thindex = document.createElement('th');
  thindex.textContent = "Index";
  theadrow.appendChild(thindex);
  let thtop;
  for (let i = 0; i < 10; i++) {
    thtop = document.createElement('th');
    thtop.textContent = i;
    theadrow.appendChild(thtop);
  }
  table.appendChild(theadrow);
  // The following sets up the following rows
  let tr, th, char, td;
  for (let i = 0; i < 10; i++){
    tr = document.createElement('tr');
    th = document.createElement('th');
    // get index row character
    char = String.fromCharCode(('A'.charCodeAt(0) + i));
    th.textContent = char;
    tr.appendChild(th);
    // fill rest of row
    for (let j = 0; j < 10; j++){
      td = document.createElement('td');
      let cellContent = gameboard.getGameboard()[i][j];
      td.textContent = cellContent === 'O' ? '.' : cellContent; // Use this when not testing
      // td.textContent = cellContent;  // Use when testing
      if (!playerTable) {
        td.addEventListener('click', (e) => {
          let playerAttacked = player.playerAttack(gameboard, i, j); // if successful, returns true
          console.log(`You the player attacked position: ${i}, ${j}`);
          if (gameboard.checkGameover()) alert('Game is over! The player won!');
          if (playerAttacked) {
            // Need to select the specific td element. Try using the event.target or something like that here to get the correct element.
            let thisTD = e.target;
            let cellContent = gameboard.getGameboard()[i][j];
            thisTD.textContent = cellContent; // must update table to show attack mark on gameboard
            // now must have npc do their turn. Since this is not asynchronous, should disallow race conditions
            console.log(`And now the npc attacks...`);
            npc.aiAttack(player.gameboard);
            // Need to rerender npc table now... how to do this...
            // method that takes an existing table and renders gameboard over it?
            rerenderGameboard(player.gameboard, document.querySelector('.playerTable'))
            // maybe here check for game over
            if (player.gameboard.checkGameover()) alert('Game is over! NPC player won!');

          }
        });
      } else {
        // give unique positional id's only to td elements of the players table
        td.id = `td${i}-${j}`;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function rerenderGameboard(someGameboard, table) {
  // this function assumes the table was already made. we're just rerendering its updated contents
  // basically loop through the td elements with a double for loop. use the id on 
  // each. have the table show the contents of the gameboard. This will be called
  // after each ai turn, so only one thing should change at a time ever.
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let td = table.querySelector(`td#td${i}-${j}`);
      td.textContent = someGameboard.gameboard[i][j];
    }
  }
}