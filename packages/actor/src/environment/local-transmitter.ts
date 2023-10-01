import { MessageTransmitter } from './message-transmitter';
import { ActorLocalResolver } from './actor-local-resolver';

export class LocalTransmitter extends MessageTransmitter {
  constructor(private readonly resolver: ActorLocalResolver) {
    super();
  }

  send(address: string, message: any) {
    const actor = this.resolver.resolve(address);
    if (actor) {
      return actor.tell(message);
    }
  }
}
