import { Machine } from "../../../src/machine/Machine";
import { MachineController } from "../../../src/machine/MachineController";
import { MachineRefillEvent, MachineSaleEvent } from "../../../src/machine/MachineEvent";
import { MachineEventGenerator } from "../../../src/machine/MachineEventGenerator";
import { IMachinePublishSubscribeService } from "../../../src/machine/MachinePublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, MachineStockWarningSubscriber } from "../../../src/machine/MachineSubscriber";

describe('MachineController', () => {
  let machines: Machine[];
  let mockPubSubService: IMachinePublishSubscribeService;
  let controller: MachineController;

  beforeEach(() => {
    // Initialize the machines array with mock machines
    machines = [new Machine('000'), new Machine('001'), new Machine('002')];

    // Mock implementation for the publish/subscribe service
    mockPubSubService = {
      subscribe: jest.fn(),
      publish: jest.fn(),
      getSubscribers: jest.fn().mockReturnValue({}),
      getMachines: jest.fn().mockReturnValue(machines),
      unsubscribe: jest.fn(),
    } as jest.Mocked<IMachinePublishSubscribeService>;

    // Setup the static mock for event generation
    jest.spyOn(MachineEventGenerator, 'eventGenerator').mockReturnValueOnce(new MachineSaleEvent(1, '001')).mockReturnValueOnce(new MachineRefillEvent(1, '001'));

    // Initialize the controller with mocked dependencies
    controller = new MachineController(machines, mockPubSubService);
  });

  it('should subscribe and publish events correctly', () => {
    controller.service();

    // Check that eventGenerator was called
    expect(MachineEventGenerator.eventGenerator).toHaveBeenCalled();

    // Check that subscribe was called with the correct arguments for sale event
    expect(mockPubSubService.subscribe).toHaveBeenCalledWith('sale', expect.any(MachineSaleSubscriber));

    // Check that publish was called with the correct arguments for sale event
    expect(mockPubSubService.publish).toHaveBeenCalledWith(expect.any(MachineSaleEvent));

    // Check that subscribe was called with the correct arguments for refill event
    expect(mockPubSubService.subscribe).toHaveBeenCalledWith('refill', expect.any(MachineRefillSubscriber));

    // Check that publish was called with the correct arguments for refill event
    expect(mockPubSubService.publish).toHaveBeenCalledWith(expect.any(MachineRefillEvent));

    // Check that subscribe was called with the correct arguments for stockWarning event
    expect(mockPubSubService.subscribe).toHaveBeenCalledWith('stockWarning', expect.any(MachineStockWarningSubscriber));

    // Check that publish was called with the correct arguments for stockWarning event
    expect(mockPubSubService.publish).toHaveBeenCalledWith(expect.any(MachineSaleEvent));

    // Verify the subscribe method was called for each event type
    expect(mockPubSubService.subscribe).toHaveBeenCalledTimes(10); // 5 events * 2 subscribers each

    // Verify the publish method was called for each event
    expect(mockPubSubService.publish).toHaveBeenCalledTimes(5);
  });
});