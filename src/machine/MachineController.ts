import { IEvent } from "../utils/pubsub/IEvent";
import { Machine } from "./Machine";
import { MachineRefillEvent, MachineSaleEvent } from "./MachineEvent";
import { MachineEventGenerator } from "./MachineEventGenerator";
import { IMachinePublishSubscribeService } from "./MachinePublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, MachineStockWarningSubscriber, MachineSubscriber } from "./MachineSubscriber";


export class MachineController {
  constructor(private machines: Machine[], private pubSubService: IMachinePublishSubscribeService) {}

  service(): void {
    // create a machine event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber: MachineSubscriber = new MachineSaleSubscriber(this.machines);
    const refillSubscriber: MachineSubscriber = new MachineRefillSubscriber(this.machines);
    const stockWarningSubscriber: MachineSubscriber = new MachineStockWarningSubscriber(this.machines);

    // create 5 random events
    const events: IEvent[] = [1, 2, 3, 4, 5].map(i => MachineEventGenerator.eventGenerator());
    console.log("events size:", events);
    console.log("before subscribe:", this.pubSubService.getSubscribers());
    for(let event of events) {
      const eventType = event.type();
      if (event instanceof MachineSaleEvent) {
        this.pubSubService.subscribe(eventType, saleSubscriber);
      } else if (event instanceof MachineRefillEvent) {
        this.pubSubService.subscribe(eventType, refillSubscriber);
      }
      this.pubSubService.subscribe('stockWarning', stockWarningSubscriber);
    };
    console.log("after subscribe:", this.pubSubService.getSubscribers());

    console.log("before mahcines:", this.machines);

    // publish the events
    for(let event of events) {
      this.pubSubService.publish(event);
    }

    console.log("after mahcines:", this.machines);
  }
}
