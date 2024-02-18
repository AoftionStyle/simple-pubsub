import { Machine } from "./Machine";
import { MachineRefillEvent, MachineSaleEvent } from "./MachineEvent";
import { MachineEventGenerator } from "./MachineEventGenerator";
import { IMachinePublishSubscribeService, MachinePublishSubscribeService } from "./MachinePublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, MachineStockWarningSubscriber } from "./MachineSubscriber";


export class MachineController {
  service(): void {
    // create 5 random events
    const machineEventGenerator: MachineEventGenerator = new MachineEventGenerator();
    const events = [1, 2, 3, 4, 5].map(i => machineEventGenerator.eventGenerator());
    console.log("Machine Controller events size:", events);

    // Create 3 machines with a quantity of 10 stock.
    // id '000' reserved index
    const machines: Machine[] = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];

    // create a machine event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    const stockWarningSubscriber = new MachineStockWarningSubscriber(machines);

    // create the PubSub service
    const pubSubService: IMachinePublishSubscribeService = new MachinePublishSubscribeService(machines);

    console.log("before subscribe:", pubSubService.getSubscribers());
    for(let event of events) {
      const eventType = event.type();
      if (event instanceof MachineSaleEvent) {
        pubSubService.subscribe(eventType, saleSubscriber);
      } else if (event instanceof MachineRefillEvent) {
        pubSubService.subscribe(eventType, refillSubscriber);
      }
      pubSubService.subscribe('stockWarning', stockWarningSubscriber);
    };
    console.log("after subscribe:", pubSubService.getSubscribers());

    console.log("before mahcines:", machines);

    // publish the events
    for(let event of events) {
      pubSubService.publish(event);
    }

    console.log("after mahcines:", machines);
  }
}
