import { IEvent } from "../utils/pubsub/IEvent";
import { ISubscriber } from "../utils/pubsub/ISubscriber";
import { Machine } from "./Machine";
import { MachineRefillEvent, MachineSaleEvent } from "./MachineEvent";

export abstract class MachineSubscriber implements ISubscriber {
  constructor (protected machines: Machine[]) {
    this.machines = machines;
  }

  handle(event: IEvent): void {
    throw new Error("Method not implemented.");
  }
}

export class MachineSaleSubscriber extends MachineSubscriber {
  // update handle(event: MachineSaleEvent) with use event.machineId() as position machines[]
  // overriding super class method
  handle(event: MachineSaleEvent): void {
    // to decresing stockLevel by event.getSoldQuantity()
    this.machines[Number(event.machineId())].stockLevel -= event.getSoldQuantity();
  }
}

export class MachineRefillSubscriber extends MachineSubscriber {
  // update handle(event: MachineRefillEvent) with use event.machineId as position machines[]
  // overriding super class method
  handle(event: MachineRefillEvent): void {
    // to increasing stockLevel by event.getRefillQuantity()
    this.machines[Number(event.machineId())].stockLevel += event.getRefillQuantity();
  }
}

const WARNING_THREADSHOLD: number = 3;
/**
 * create class StockWarningSubscriber
 * handle(event: IEvent) covered by MachineSaleEvent and MahcineRefillEvent
*/
export class MachineStockWarningSubscriber extends MachineSubscriber {
  // if a machine stock levels drops below 3 a new Event, LowStockWarningEvent should be generated. 
  // when the stock levels hits 3 or above (because of a MachineRefillEvent), a StockLevelOkEvent should be generated.
  // overriding super class method
  public handle(event: IEvent): void {
    if (event instanceof MachineRefillEvent && this.machines[Number(event.machineId())].stockLevel >= WARNING_THREADSHOLD) {
      this.machines[Number(event.machineId())].stockStatus = 'StockLevelOkEvent';
    } else if (this.machines[Number(event.machineId())].stockLevel < WARNING_THREADSHOLD) {
      this.machines[Number(event.machineId())].stockStatus = 'LowStockWarningEvent';
    }
  }
}
