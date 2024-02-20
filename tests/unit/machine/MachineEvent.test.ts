import { MachineEvent, MachineRefillEvent, MachineSaleEvent } from "../../../src/machine/MachineEvent";

describe('MachineEvent', () => {
  let mEvent: MachineEvent;

  beforeEach(() => {
    class MEvent extends MachineEvent {

    }
    mEvent = new MEvent(1, '001');
  })

  it('should throw an error when type is called', () => {
    expect(() => mEvent.type()).toThrow('Method not implemented.');
  });

  it('should throw an error when machineId is called', () => {
    expect('001').toEqual(mEvent.machineId());
  });

  it('should throw an error when getQuantity is called', () => {
    expect(1).toEqual(mEvent.getQuantity());
  });
});

describe('MachineSaleEvent', () => {
  let saleEvent: MachineSaleEvent;

  beforeEach(() => {
    saleEvent = new MachineSaleEvent(1, '001');
  })

  it('should generate a sale event', () => {
    expect('sale').toEqual(saleEvent.type());
    expect(1).toEqual(saleEvent.getSoldQuantity());
    expect('001').toEqual(saleEvent.machineId());
  })
});

describe('MachineRefillEvent', () => {
  let refillEvent: MachineRefillEvent;

  beforeEach(() => {
    refillEvent = new MachineRefillEvent(1, '002');
  })

  it('should generate a refill event', () => {
    expect('refill').toEqual(refillEvent.type());
    expect(1).toEqual(refillEvent.getRefillQuantity());
    expect('002').toEqual(refillEvent.machineId());
  })
});