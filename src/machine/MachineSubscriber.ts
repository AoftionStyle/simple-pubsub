import { IEvent } from "../pubsub/IEvent";
import { ISubscriber } from "../pubsub/ISubscriber";
import { Machine } from "./Machine";
import { MachineRefillEvent, MachineSaleEvent } from "./MachineEvent";


// update handle(event: MachineSaleEvent) with use event.machineId() as position machines[]
// to decresing stockLevel by event.getSoldQuantity()
export class MachineSaleSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor (machines: Machine[]) {
    this.machines = machines; 
  }

  handle(event: MachineSaleEvent): void {
    this.machines[Number(event.machineId())].stockLevel -= event.getSoldQuantity();
  }
}

// update handle(event: MachineRefillEvent) with use event.machineId as position machines[]
// to increasing stockLevel by event.getRefillQuantity()
export class MachineRefillSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor (machines: Machine[]) {
    this.machines = machines; 
  }

  handle(event: MachineRefillEvent): void {
    this.machines[Number(event.machineId())].stockLevel += event.getRefillQuantity();
  }
}

/**
 * create class StockWarningSubscriber with implement ISubscriber
 * handle(event: IEvent) covered by MachineSaleEvent and MahcineRefillEvent
 * if a machine stock levels drops below 3 a new Event, LowStockWarningEvent should be generated. 
 * when the stock levels hits 3 or above (because of a MachineRefillEvent), a StockLevelOkEvent should be generated.
 */
export class StockWarningSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  handle(event: IEvent): void {
    if (event instanceof MachineRefillEvent && this.machines[Number(event.machineId())].stockLevel >= 3) {
      this.machines[Number(event.machineId())].stockStatus = 'StockLevelOkEvent';
    } else if (this.machines[Number(event.machineId())].stockLevel < 3) {
      this.machines[Number(event.machineId())].stockStatus = 'LowStockWarningEvent';
    }
  }
}
