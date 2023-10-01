import {
  RegisterMessage,
  MessageType,
  Optional,
  Message,
} from '@anyit/messaging';
import { ActorMessage, ActorMessageArgs } from './actor-message';
import { ActorRef } from '../actor-ref';

export type SubscribeMessageArgs = Optional<
  ActorMessageArgs<Subscribe>,
  'messageTypes'
>;

@RegisterMessage('01H72V9YJNPNJ0G7PYAR4RFKJB')
export class Subscribe extends ActorMessage {
  constructor(args: SubscribeMessageArgs) {
    super(args);

    this.listener = this.getActorRef(args.listener);
    if (args.messageTypes) {
      this.messageTypes = this.getMessageTypes(args.messageTypes);
    } else {
      this.messageTypes = null;
    }
  }

  readonly listener: ActorRef;

  readonly messageTypes: ReadonlyArray<MessageType> | null;
}

export const isSubscribeMessage = (
  message?: Message | void,
): message is Subscribe => Boolean(message && message.code === Subscribe.code);
