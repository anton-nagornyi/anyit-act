import { MessageTransmitter } from './environment/message-transmitter';
import { Actor } from './actor';
import { Message } from '@anyit/messaging';

type AskReturn<T extends Message> = Promise<
  Omit<Awaited<ReturnType<Actor['ask']>>, 'reason'> & { reason: T }
>;

export class ActorRef {
  constructor(
    readonly address: string,
    private readonly transmitter: MessageTransmitter,
  ) {}

  tell<TMessage extends Message>(message: TMessage) {
    return this.transmitter.send(this.address, message);
  }

  ask<TMessage extends Message>(message: TMessage): AskReturn<TMessage> {
    return this.transmitter.request(this.address, message);
  }
}
