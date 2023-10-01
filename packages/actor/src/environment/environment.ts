import { MessageTransmitter } from './message-transmitter';
import { ActorResolver } from './actor-resolver';

export class Environment {
  constructor(
    readonly name: string,
    readonly resolver: ActorResolver,
    readonly transmitter: MessageTransmitter,
  ) {}
}
