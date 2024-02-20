import { IEvent } from "../utils/pubsub/IEvent";

type MachineEventType = 'sale' | 'refill' | 'stockWarning';

export abstract class MachineEvent implements IEvent {
  constructor (protected readonly _quantity: number, protected readonly _machineId: string) {}

  type(): string {
    throw new Error("Method not implemented.");
  }
  machineId(): string {
    return this._machineId;
  }
  getQuantity(): number {
    return this._quantity;
  }
}

export class MachineSaleEvent extends MachineEvent {
  constructor(protected readonly _sold: number, protected readonly _machineId: string) {
    super(_sold, _machineId);
  }

  getSoldQuantity(): number {
    return this.getQuantity();
  }

  type(): MachineEventType {
    return 'sale';
  }
}

// update machineId() when return _mahcineId from constructor
// add getRefillQuantity() when return _refill from constructor
// update type when return 'refill';
export class MachineRefillEvent extends MachineEvent {
  constructor(protected readonly _refill: number, protected readonly _machineId: string) {
    super(_refill, _machineId);
  }

  getRefillQuantity(): number {
    return this._refill;
  }

  type(): MachineEventType {
    return 'refill';
  }
}