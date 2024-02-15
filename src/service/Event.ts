// interfaces
export interface IEvent {
  type(): string;
  machineId(): string;
}


// implementations
export class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): string {
    return 'sale';
  }
}

// update machineId() when return _mahcineId from constructor
// add getRefillQuantity() when return _refill from constructor
// update type when return 'refill';
export class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getRefillQuantity(): number {
    return this._refill;
  }

  type(): string {
    return 'refill';
  }
}