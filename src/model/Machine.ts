// objects
export class Machine {
  public stockLevel: number = 10;
  public id: string;
  public stockStatus: 'StockLevelOkEvent' | 'LowStockWarningEvent' = "StockLevelOkEvent";

  constructor(id: string) {
    this.id = id;
  }
}
