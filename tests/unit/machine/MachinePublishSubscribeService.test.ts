import { Machine } from "../../../src/machine/Machine";
import { MachineEvent, MachineRefillEvent, MachineSaleEvent } from "../../../src/machine/MachineEvent";
import { EventSubscriber, IMachinePublishSubscribeService, MachinePublishSubscribeService } from "../../../src/machine/MachinePublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, MachineStockWarningSubscriber, MachineSubscriber } from "../../../src/machine/MachineSubscriber";
import { IEvent } from "../../../src/utils/pubsub/IEvent";
import { ISubscriber } from "../../../src/utils/pubsub/ISubscriber";


describe('MachinePublishSubscribeService', () => {
  let machines: Machine[];
  let pubSubService: IMachinePublishSubscribeService;
  let subscribers: EventSubscriber;

  beforeEach(() => {
    machines = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];
    pubSubService = new MachinePublishSubscribeService(machines);
    subscribers = {};
  })

  it('should return machines', () => {
    expect(pubSubService.getMachines()).toEqual(machines);
  });

  it('should return subscribers', () => {
    expect(pubSubService.getSubscribers()).toEqual(subscribers);
  });

  it('should subscribe to event', () => {
    const eventType = 'sale';
    const subscriber: MachineSubscriber = new MachineSaleSubscriber(machines);

    subscribers[eventType] = subscriber;
    pubSubService.subscribe(eventType, subscriber);
    expect(subscribers).toEqual(pubSubService.getSubscribers());
  });

  it('should unsubscribe from event', () => {
    const eventType = 'sale';
    const subscriber: MachineSubscriber = new MachineSaleSubscriber(machines);

    pubSubService.subscribe(eventType, subscriber);
    pubSubService.unsubscribe(eventType);
    expect(pubSubService.getSubscribers()[eventType]).toBeUndefined();
  });

  it('should handle the case where the subscriber for event type is defined', () => {
    const eventType = 'sale';
    const event: IEvent = { type: () => eventType, machineId: () => '001' };
    const saleSubscriber: ISubscriber = { handle: jest.fn() };
    const stockWarningSubscriber: ISubscriber = { handle: jest.fn() };

    pubSubService.subscribe(eventType, saleSubscriber);
    pubSubService.subscribe('stockWarning', stockWarningSubscriber);
    pubSubService.publish(event);

    expect(saleSubscriber.handle).toHaveBeenCalledTimes(1);
    expect(saleSubscriber.handle).toHaveBeenCalledWith(event);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledTimes(1);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(event);
  });

  it('should handle the case where the subscriber for "sale" event is not defined', () => {
    const eventType = 'sale';
    const event: IEvent = { type: () => eventType, machineId: () => '001' };

    // Ensure that the subscriber for "sale" event is not defined
    expect(subscribers[eventType]).toBeUndefined();
    expect(() => pubSubService.publish(event)).not.toThrow();
  });

  it('should handle the subscribers for "sale" and "refill" events to a mahcine', () => {
    const events: MachineEvent[] = [
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      new MachineRefillEvent(5, '001'),
      new MachineSaleEvent(2, '001'), 
    ];
    const saleSubscriber: ISubscriber = { handle: jest.fn() };
    const refillSubscriber: ISubscriber = { handle: jest.fn() };
    const stockWarningSubscriber: ISubscriber = { handle: jest.fn() };

    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber);
    pubSubService.subscribe('stockWarning', stockWarningSubscriber);

    // publish the events
    for(let event of events) {
      pubSubService.publish(event);
    }

    // behaviors saleSubscriber
    expect(saleSubscriber.handle).toHaveBeenCalledTimes(4);
    expect(saleSubscriber.handle).toHaveBeenCalledWith(events[0]);
    expect(saleSubscriber.handle).toHaveBeenCalledWith(events[1]);
    expect(saleSubscriber.handle).toHaveBeenCalledWith(events[2]);
    expect(saleSubscriber.handle).not.toHaveBeenCalledWith(events[3]);
    expect(saleSubscriber.handle).toHaveBeenCalledWith(events[4]);

    // behaviors refillSubscriber
    expect(refillSubscriber.handle).toHaveBeenCalledTimes(1);
    expect(refillSubscriber.handle).not.toHaveBeenCalledWith(events[0]);
    expect(refillSubscriber.handle).not.toHaveBeenCalledWith(events[1]);
    expect(refillSubscriber.handle).not.toHaveBeenCalledWith(events[2]);
    expect(refillSubscriber.handle).toHaveBeenCalledWith(events[3]);
    expect(refillSubscriber.handle).not.toHaveBeenCalledWith(events[4]);

    // behaviors stockWarningSubscriber
    expect(stockWarningSubscriber.handle).toHaveBeenCalledTimes(5);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(events[0]);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(events[1]);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(events[2]);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(events[3]);
    expect(stockWarningSubscriber.handle).toHaveBeenCalledWith(events[4]);
  });

  it('should handle the subscribers for "sale" events to a mahcine and stockLevele & stockStatus', () => {
    const events: MachineEvent[] = [
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      // new MachineRefillEvent(5, '001'),
      new MachineSaleEvent(2, '001'), 
    ];
    const saleSubscriber: ISubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber: ISubscriber = new MachineRefillSubscriber(machines);
    const stockWarningSubscriber: ISubscriber = new MachineStockWarningSubscriber(machines);

    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber);
    pubSubService.subscribe('stockWarning', stockWarningSubscriber);

    // publish the events
    for(let event of events) {
      pubSubService.publish(event);
    }

    expect(machines[Number('001')].stockLevel).toEqual(2);
    expect(machines[Number('001')].stockStatus).toEqual('LowStockWarningEvent');
  });

  it('should handle the subscribers for "sale" and "refill" events to a mahcine and stockLevele & stockStatus', () => {
    const events: MachineEvent[] = [
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      new MachineSaleEvent(2, '001'), 
      new MachineRefillEvent(5, '001'),
      new MachineSaleEvent(2, '001'), 
    ];
    const saleSubscriber: ISubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber: ISubscriber = new MachineRefillSubscriber(machines);
    const stockWarningSubscriber: ISubscriber = new MachineStockWarningSubscriber(machines);

    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber);
    pubSubService.subscribe('stockWarning', stockWarningSubscriber);

    // publish the events
    for(let event of events) {
      pubSubService.publish(event);
    }

    expect(machines[Number('001')].stockLevel).toEqual(7);
    expect(machines[Number('001')].stockStatus).toEqual('StockLevelOkEvent');
  });
});