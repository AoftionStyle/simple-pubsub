import { Machine } from "../../../src/machine/Machine";

const myMachine: Machine = new Machine('000');

test('initlized Machine', () => {
  expect(myMachine.id).toBe('000');
  expect(myMachine.stockLevel).toBe(10);
  expect(myMachine.stockStatus).toBe('StockLevelOkEvent');
});