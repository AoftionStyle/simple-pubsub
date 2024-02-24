import { Machine } from "./machine/Machine";
import { MachineController } from "./machine/MachineController";
import { IMachinePublishSubscribeService, MachinePublishSubscribeService } from "./machine/MachinePublishSubscribeService";


// program
(async () => {
  // Create 3 machines with a quantity of 10 stock.
  // id '000' reserved index
  const machines: Machine[] = [new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003')];

  // create the PubSub service
  const pubSubService: IMachinePublishSubscribeService = new MachinePublishSubscribeService(machines);

  const machineController = new MachineController(machines, pubSubService);
  machineController.service();
})();