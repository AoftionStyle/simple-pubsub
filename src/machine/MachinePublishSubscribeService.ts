import { IEvent } from "../utils/pubsub/IEvent";
import { IPublishSubscribeService } from "../utils/pubsub/IPublishSubscribeService";
import { ISubscriber } from "../utils/pubsub/ISubscriber";
import { Machine } from "./Machine";

export interface EventSubscriber {
  [eventType: string]: ISubscriber | undefined; // index signature for map eventType as key and ISubscriber as value
}

export interface IMachinePublishSubscribeService extends IPublishSubscribeService {
  getMachines(): Machine[];
  getSubscribers(): EventSubscriber;
}

/**
 * create class PublishSubscribeService with implement IPublishSubscribeService
 * publish(event: IEvent) covered by MachineSaleEvent and MahcineRefillEvent
 * subscribe(eventType: string, handler: ISubscriber) covered by eventType 'sale', 'refill' and 'stockWarning' MachineSaleSubscriber, MachineRefillSubscriber and StockWarningSubscriber
 * unsubscribe(eventType: string) covered by 'sale', 'refill' and 'stockWarning'
 */
export class MachinePublishSubscribeService implements IMachinePublishSubscribeService {
  public machines: Machine[];
  public subscribers: EventSubscriber = {};

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  getMachines(): Machine[] {
    return this.machines;
  }

  getSubscribers(): EventSubscriber {
    return this.subscribers;
  }

  publish(event: IEvent): void {
    this.subscribers[event.type()]?.handle(event);
    this.subscribers['stockWarning']?.handle(event);
  }
  subscribe(eventType: string, subscriber: ISubscriber): void {
    this.subscribers[eventType] = subscriber;
  }
  unsubscribe(eventType: string): void {
    this.subscribers[eventType] = undefined;
  }
}
