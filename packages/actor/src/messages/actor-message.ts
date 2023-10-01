import { Message, MessageArgs } from '@anyit/messaging';
import { ActorRef } from '../actor-ref';
import { ActorSystem } from '../actor-system';

type ActorRefArgs<T> = {
  [K in keyof T]: T[K] extends ActorRef ? string | ActorRef : T[K];
};

export type ActorMessageArgs<T extends Message> = ActorRefArgs<MessageArgs<T>>;

export abstract class ActorMessage extends Message {
  protected getActorRef(actor: string | ActorRef) {
    if (actor instanceof ActorRef) {
      return actor;
    } else {
      return ActorSystem.getRef(actor);
    }
  }
}
