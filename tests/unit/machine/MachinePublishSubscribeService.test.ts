import { Machine } from "../../../src/machine/Machine";
import { EventSubscriber, IMachinePublishSubscribeService, MachinePublishSubscribeService } from "../../../src/machine/MachinePublishSubscribeService";
import { MachineSaleSubscriber, MachineSubscriber } from "../../../src/machine/MachineSubscriber";
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

  it('should unsubscribe from event', () => {
    const eventType = 'sale';
    const subscriber: MachineSubscriber = new MachineSaleSubscriber(machines);

    pubSubService.subscribe(eventType, subscriber);
    pubSubService.unsubscribe(eventType);
    expect(pubSubService.getSubscribers()[eventType]).toBeUndefined();
  });
});