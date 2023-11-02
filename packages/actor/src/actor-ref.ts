import { MessageTransmitter } from './environment/message-transmitter';
import { Actor } from './actor';
import { Message } from '@anyit/messaging';

type ArgumentUnion<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => any
    ? K extends 'tell'
      ? never
      : A[number]
    : never;
}[keyof T];

type IsSubType<Base, T extends Base> = T extends Base
  ? Base extends T
    ? false
    : true
  : false;

type IsDerivedFromActor<T extends Actor> = IsSubType<Actor, T>;

export type AllowedMessages<T extends Actor> =
  IsDerivedFromActor<Actor> extends true
    ? Exclude<ArgumentUnion<T>, 'Message' | undefined>
    : Message;

export class ActorRef<T extends Actor = Actor> {
  constructor(
    readonly address: string,
    private readonly transmitter: MessageTransmitter,
  ) {}

  tell(message: AllowedMessages<T>) {
    return this.transmitter.send(this.address, message);
  }

  ask(message: AllowedMessages<T>) {
    return this.transmitter.request(this.address, message);
  }
}
