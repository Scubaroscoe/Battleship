const Gameboard = require('./Gameboard');
const shipFactory = require('./ship');
const Player = require('./Player');

let gameboard = Gameboard();
let pName = "Some Player";


let player = Player(pName, gameboard);

// This is not a regular test, but it did help me debug things
test('aiSetGameboard test. Not sure what to test, but want to see console output', () => {
  player.aiSetGameboard();
  player.getPlayerGameboard().getGameboard();
  expect(0).toBe(0);
});

// This is not a regular test, but it did help me debug things
let pGB = player.getPlayerGameboard();
test('aiAttack test. Not sure what to test, but want to see outputs', () => {
  expect(player.aiAttack(pGB)).toBe(true);
});


test('playerAttack test: Sad path illegal coords', () => {
  expect(player.playerAttack(pGB, -1, 2)).toBe(false);
});

test('playerAttack test: Sad path already attacked coords', () => {
  player.playerAttack(pGB, 5, 5);
  expect(player.playerAttack(pGB, 5, 5)).toBe(false);
});

// This test or rather this method is imperfect, but leaving for now.
test('playerAttack test: Happy path legal coords (unattacked)', () => {
  expect(player.playerAttack(pGB, 7, 7)).toBe(true);
});