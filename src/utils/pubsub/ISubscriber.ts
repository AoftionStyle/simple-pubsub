import { IEvent } from "../../event/IEvent";


export interface ISubscriber {
  handle(event: IEvent): void;
}
