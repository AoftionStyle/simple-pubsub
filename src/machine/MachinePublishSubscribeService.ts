import { IEvent } from "../pubsub/IEvent";
import { IPublishSubscribeService } from "../pubsub/IPublishSubscribeService";
import { ISubscriber } from "../pubsub/ISubscriber";
import { Machine } from "./Machine";
import { MachineRefillSubscriber, MachineSaleSubscriber, StockWarningSubscriber } from "./MachineSubscriber";

/**
 * create class PublishSubscribeService with implement IPublishSubscribeService
 * publish(event: IEvent) covered by MachineSaleEvent and MahcineRefillEvent
 * subscribe(type: string, handler: ISubscriber) covered by MachineSaleSubscriber, MachineRefillSubscriber and StockWarningSubscriber
 * unsubscribe(event: IUnsubscriber) covered by MachineSaleEvent and MahcineRefillEvent
 */
export class PublishSubscribeService implements IPublishSubscribeService {
  public machines: Machine[];
  private saleSubscriber!: MachineSaleSubscriber;
  private refillSubscriber: MachineRefillSubscriber | undefined;
  public stockWarningSubscriber!: StockWarningSubscriber;

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  publish(event: IEvent): void {
    console.log("the event:", event);
    // console.info("before eventType:", event.type(), " id:", event.machineId(), " machine:", this.machines[Number(event.machineId())]);
    // console.info("this.saleSubscriber:", this.saleSubscriber);
    // if (event instanceof MachineSaleEvent) {
    //   this.saleSubscriber?.handle(event);
    // } 
    // else if (event instanceof MachineRefillEvent) {
    //   this.refillSubscriber?.handle(event);
    // }
    // this.stockWarningSubscriber.handle(event);
    // console.info("after eventType:", event.type(), " id:", event.machineId(), " machine:", this.machines[Number(event.machineId())]);
    console.info("=========");
  }
  subscribe(handler: ISubscriber): void {
    if (handler instanceof MachineSaleSubscriber) {
      this.saleSubscriber = handler;
      console.debug("this.saleSubscriber:", this.saleSubscriber);
    } else if (handler instanceof MachineRefillSubscriber) {
      this.refillSubscriber = handler;
      console.debug("this.refillSubscriber:", this.refillSubscriber);
    } else if (handler instanceof StockWarningSubscriber) {
      this.stockWarningSubscriber = handler;
      console.debug("this.stockWarningSubscriber:", this.stockWarningSubscriber);
    }
  }
  unsubscribe(event: IEvent): void {
    throw new Error("Method not implemented.");
  }
}
