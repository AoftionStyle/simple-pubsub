import { MachineRefillEvent, MachineSaleEvent } from "../../../src/machine/MachineEvent";
import { MachineEventGenerator } from "../../../src/machine/MachineEventGenerator";

describe('MachineEventGenerator', () => {
  let eventGenerator: MachineEventGenerator;

  beforeEach(() => {
    eventGenerator = new MachineEventGenerator();
  });

  it('should generate a sale event with quantity 1 or 2', () => {
    // Mock Math.random() to return 0.4 for the first call and 0.5 for the second call
    const randomMock = jest.spyOn(Math, 'random').mockReturnValueOnce(0.4).mockReturnValueOnce(0.5);

    const event = eventGenerator.eventGenerator();
    expect(event).toBeInstanceOf(MachineSaleEvent);
    const saleEvent = event as MachineSaleEvent;
    expect('sale').toEqual(saleEvent.type());
    expect([1,2]).toContain(saleEvent.getSoldQuantity());
    expect(['001', '002', '003']).toContain(saleEvent.machineId());

    randomMock.mockRestore(); // Restore the original Math.random() implementation
  });

  it('should generate a refill event with quantity 3 or 5', () => {
    // Mock Math.random() to return 0.6 for the first call and 0.7 for the second call
    const randomMock = jest.spyOn(Math, 'random').mockReturnValueOnce(0.6).mockReturnValueOnce(0.7);

    const event = eventGenerator.eventGenerator();
    expect(event).toBeInstanceOf(MachineRefillEvent);
    const refillEvent = event as MachineRefillEvent;
    expect('refill').toEqual(refillEvent.type());
    expect([3,5]).toContain(refillEvent.getRefillQuantity());
    expect(['001', '002', '003']).toContain(refillEvent.machineId());

    randomMock.mockRestore(); // Restore the original Math.random() implementation
  });

    it('should generate random machine IDs', () => {
      const event = eventGenerator.eventGenerator();
      const machineId = event.machineId();
      expect(['001', '002', '003']).toContain(machineId);
    });
});
