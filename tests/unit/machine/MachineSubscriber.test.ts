import { Machine } from "../../../src/machine/Machine";
import { MachineRefillEvent, MachineSaleEvent } from "../../../src/machine/MachineEvent";
import { MachineRefillSubscriber, MachineSaleSubscriber, MachineStockWarningSubscriber, MachineSubscriber } from "../../../src/machine/MachineSubscriber";

describe('MachineSubscriber', () => {
  let machines: Machine[];
  let subscriber: MachineSubscriber;

  beforeEach(() => {
    machines = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];;
    class MSubscriber extends MachineSubscriber {}
    subscriber = new MSubscriber(machines);
  });

  it('should throw an error when handle is called', () => {
    expect(() => subscriber.handle(new MachineSaleEvent(1, '001'))).toThrowError('Method not implemented.');
  });
});

describe('MachineSaleSubscriber', () => {
  let machines: Machine[];
  let subscriber: MachineSaleSubscriber;

  beforeEach(() => {
    machines = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];;
    subscriber = new MachineSaleSubscriber(machines);
  });

  it('should decrease stockLevel when handling a sale event', () => {
    const saleEvent = new MachineSaleEvent(2, '001');
    subscriber.handle(saleEvent);
    expect(8).toEqual(machines[Number('001')].stockLevel);
  });

});

describe('MachineRefillSubscriber', () => {
  let machines: Machine[];
  let subscriber: MachineRefillSubscriber;

  beforeEach(() => {
    machines = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];;
    subscriber = new MachineRefillSubscriber(machines);
  });

  it('should increase stockLevel when handling a refill event', () => {
    const refillEvent = new MachineRefillEvent(3, '001');
    subscriber.handle(refillEvent);
    expect(13).toEqual(machines[Number('001')].stockLevel);
  });
});

describe('MachineStockWarningSubscriber', () => {
  let machines: Machine[];
  let saleSubscriber: MachineSaleSubscriber;
  let refillSubscriber: MachineRefillSubscriber;
  let warningStockSubscriber: MachineStockWarningSubscriber;

  beforeEach(() => {
    machines = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];;
    saleSubscriber = new MachineSaleSubscriber(machines);
    refillSubscriber = new MachineRefillSubscriber(machines);
    warningStockSubscriber = new MachineStockWarningSubscriber(machines);
  });

  it('should set stockStatus to LowStockWarningEvent when stock level is below 3', () => {
    const saleEvent = new MachineSaleEvent(10, '001');
    saleSubscriber.handle(saleEvent);
    warningStockSubscriber.handle(saleEvent);
    expect('LowStockWarningEvent').toBe(machines[Number('001')].stockStatus);
  });

  it('should set stockStatus to StockLevelOkEvent when stock level is 3 or above after a refill event', () => {
    const refillEvent = new MachineRefillEvent(3, '002');
    refillSubscriber.handle(refillEvent);
    warningStockSubscriber.handle(refillEvent);
    expect('StockLevelOkEvent').toBe(machines[Number('002')].stockStatus);
  });
});