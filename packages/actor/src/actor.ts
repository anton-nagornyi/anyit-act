import {
  ErrorMessage,
  isErrorMessage,
  isSuccessMessage,
  Message,
} from '@anyit/messaging';
import { Subscribe } from './messages/subscribe';
import { MessageHandlers, Receive } from '@anyit/message-handling';
import { ActorRef } from './actor-ref';

export type ActorArgs = {
  address: string;
};

export type ActorType<T extends Actor = Actor> = new (args: ActorArgs) => T;

const EmitMetadata = (_: any, __: string | symbol, ___: number) => {};

export class Actor {
  constructor(args: ActorArgs) {
    this.address = args.address;

    if (!Actor.subscriptionSet.has(this.constructor)) {
      Receive(this, 'subscribe', 0);
      Actor.subscriptionSet.add(this.constructor);
    }
  }

  private static subscriptionSet = new Set();

  readonly address: string;

  private readonly inbox = new Array<Message>();

  private listeners = new Map<string, Set<ActorRef>>();

  private everythingListeners = new Set<ActorRef>();

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(ref: ActorRef) {
    // This is intentional
  }

  protected async handleMessage(message: Message) {
    const handlers = MessageHandlers.getHandlers(
      this.constructor,
      message.code,
    );

    let handled = true;

    if (handlers) {
      for (const handler of handlers) {
        try {
          const result = await handler.handleFunction.call(this, message);
          if (isSuccessMessage(result) || isErrorMessage(result)) {
            this.emitToListeners(result);
          }
        } catch (e: any) {
          handled = false;
          this.emitToListeners(
            new ErrorMessage({
              reason: message,
              error: e,
            }),
          );
          break;
        }
      }
    }

    if (handled) {
      this.emitToListeners(message);
    }
  }

  subscribe(@EmitMetadata message: Subscribe) {
    const { listener } = message;

    const isTryingToListenToMyself = listener.address === this.address;

    if (!isTryingToListenToMyself) {
      if (message.messageTypes) {
        for (const messageToListen of message.messageTypes) {
          const listeners =
            this.listeners.get(messageToListen.code) ?? new Set<ActorRef>();
          listeners.add(listener);

          this.listeners.set(messageToListen.code, listeners);
        }
      } else {
        this.everythingListeners.add(listener);
      }
    }
  }

  tell = (message: Message) => {
    this.inbox.push(message);

    this.process();
  };

  private process() {
    while (this.inbox.length > 0) {
      const message = this.inbox.shift();

      if (message) {
        this.handleMessage(message);
      }
    }
  }

  protected emitToListeners(message: Message) {
    this.sendMessageToListeners(message, this.everythingListeners);

    const listeners = this.listeners.get(message.code);
    if (listeners) {
      this.sendMessageToListeners(message, listeners);
    }
  }

  private sendMessageToListeners(message: Message, listeners: Set<ActorRef>) {
    for (const listener of listeners) {
      listener.tell(message);
    }
  }
}
