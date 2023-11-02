import { MessageTransmitter } from './message-transmitter';
import { ActorLocalResolver } from './actor-local-resolver';
import { MissingActorError } from '../errors/missing-actor-error';

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

  request(address: string, message: any) {
    const actor = this.resolver.resolve(address);
    if (!actor) {
      throw new MissingActorError(address);
    }
    return actor.ask(message);
  }
}
