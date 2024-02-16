import { IEvent } from "../../event/IEvent";
import { ISubscriber } from "./ISubscriber";


export interface IPublishSubscribeService {
  publish(event: IEvent): void;
  // subscribe(type: string, handler: ISubscriber): void;
  subscribe(handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
  unsubscribe(event: IEvent): void;
}
