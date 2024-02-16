import { eventGenerator } from "../app";
import { IPublishSubscribeService } from "../pubsub/IPublishSubscribeService";
import { Machine } from "./Machine";
import { PublishSubscribeService } from "./MachinePublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, StockWarningSubscriber } from "./MachineSubscriber";


export class MachineController {
  publish() {
    // create 3 machines from 001..003 with a quantity of 10 stock
    // * 000 resereved index 0
    const machines: Machine[] = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];

    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    const stockWarningSubscriber = new StockWarningSubscriber(machines);

    // create the PubSub service
    // const pubSubService: IPublishSubscribeService = null as unknown as IPublishSubscribeService; // implement and fix this
    const pubSubService: IPublishSubscribeService = new PublishSubscribeService(machines);
    pubSubService.subscribe(saleSubscriber);
    pubSubService.subscribe(refillSubscriber);
    pubSubService.subscribe(stockWarningSubscriber);

    // create 5 random events
    const events = [1, 2, 3, 4, 5].map(i => eventGenerator());
    events.forEach(event => {
      // if (event instanceof MachineSaleEvent) {
      //   pubSubService.subscribe(event.type(), saleSubscriber);
      // } else if (event instanceof MachineRefillEvent) {
      //   pubSubService.subscribe(event.type(), refillSubscriber);
      // }
      // pubSubService.subscribe(event.type(), stockWarningSubscriber);
    });

    // publish the events
    events.map(pubSubService.publish);
  }
}
