import { MachineController } from "./machine/MachineController";


// program
(async () => {
  const machineController = new MachineController();
  machineController.service();
})();