const Gameboard = require('./Gameboard');
const shipFactory = require('./ship');

let GB = Gameboard();

test('setShip sad path: Coord OOB Bad X', () => {
  expect(() => GB.setShip(-1, 5, 'N', shipFactory, 3)).toThrow('Coordinates given are not within the gameboard');
});

test('setShip sad path: Coord OOB Bad Y', () => {
  expect(() => GB.setShip(5, 10, 'N', shipFactory, 3)).toThrow('Coordinates given are not within the gameboard');
});

test('setShip sad path: Bad direction W', () => {
  expect(() => GB.setShip(2, 6, 'W', shipFactory, 3)).toThrow('Direction not possible given coordinates and ship length');
});

test('setShip sad path: Bad direction E', () => {
  expect(() => GB.setShip(8, 6, 'E', shipFactory, 3)).toThrow('Direction not possible given coordinates and ship length');
});

test('setShip sad path: Bad direction N', () => {
  expect(() => GB.setShip(2, 2, 'N', shipFactory, 3)).toThrow('Direction not possible given coordinates and ship length');
});

test('setShip sad path: Bad direction S', () => {
  expect(() => GB.setShip(4, 8, 'S', shipFactory, 3)).toThrow('Direction not possible given coordinates and ship length');
});

test('setShip happy path: Legal ship addition N/S', () => {
  expect(GB.setShip(5, 5, 'S', shipFactory, 3)).toBe(0);
});

test('setShip sad path: Hitting previous ship position', () => {
  expect(() => GB.setShip(6, 6, 'W', shipFactory, 3)).toThrow('The ship you\'re adding is overlapping upon some previously placed ship');
});

test('setShip happy path: Legal ship addition W/E', () => {
  expect(GB.setShip(8, 2, 'W', shipFactory, 3)).toBe(0);
});

test('receiveAttack sad path: Bad coordinate input', () => {
  expect(() => GB.receiveAttack(10, 5)).toThrow('This attack is out of bounds');
})

GB.receiveAttack(3, 3);
test('receiveAttack sad path: Coordinate attacked more than once', () => {
  expect(() => GB.receiveAttack(3, 3)).toThrow('This coordinate has already been targeted');
})

test('receiveAttack happy path: Successful hit', () => {
  expect(GB.receiveAttack(8, 2)).toBe(0);
})

test('receiveAttack happy path: Miss', () => {
  expect(GB.receiveAttack(0, 0)).toBe(0);
})

test('Gameover happy path: Not gameover', () => {
  expect(GB.checkGameover()).toBe(false);
})

test('receiveAttack happy path: Sank ship', () => {
  GB.receiveAttack(8, 1);
  expect(GB.receiveAttack(8, 0)).toBe(0);
  GB.displayMisses();
})

test('Gameover happy path: Not gameover', () => {
  expect(GB.checkGameover()).toBe(true);
  GB.getGameboard();
})