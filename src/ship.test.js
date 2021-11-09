const shipFactory = require('./ship');
let ship = shipFactory(2);
// test('This is really just to test jest with webpack', () => {

//   expect(ship.hit(2)).toBe(3);
// });

test('Ship hit basic happy path', () => {
  expect(ship.hit(0)).toBe(0);
});

test('Ship hit sad path: Low input', () => {
  expect(() => ship.hit(-1)).toThrow('Hit is outside of bounds of ship length');
});

test('Ship hit sad path: High input', () => {
  expect(() => ship.hit(ship.getLength())).toThrow('Hit is outside of bounds of ship length');
});

test('Ship isSunk basic negative output', () => {
  expect(ship.isSunk()).toBe(false);
});

test('Ship isSunk basic positive output', () => {
  ship.hit(1);
  expect(ship.isSunk()).toBe(true);
});