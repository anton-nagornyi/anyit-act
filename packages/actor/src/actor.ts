import {
  ErrorMessage,
  isErrorMessage,
  Message,
  SuccessMessage,
} from '@anyit/messaging';
import { Subscribe } from './messages/subscribe';
import { MessageHandlers, Receive } from '@anyit/message-handling';
import { ActorRef } from './actor-ref';
import { AskTimeoutError } from './errors/ask-timeout-error';
import { AskNoHandlerError } from './errors/ask-no-handler-error';

export type ActorArgs = {
  address: string;
  askTimeout?: number;
};

export type ActorType<T extends Actor = Actor> = new (args: ActorArgs) => T;

const EmitMetadata = (_: any, __: string | symbol, ___: number) => {};

export class Actor {
  constructor(args: ActorArgs) {
    this.address = args.address;
    this.askTimeout = args.askTimeout ?? 10000;

    if (!Actor.subscriptionSet.has(this.constructor)) {
      Receive(this, 'subscribe', 0);
      Actor.subscriptionSet.add(this.constructor);
    }
  }

  private static subscriptionSet = new Set();

  readonly address: string;

  readonly askTimeout: number;

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
          await handler.handleFunction.call(this, message);
        } catch (e: any) {
          handled = false;

          const errorMessage = new ErrorMessage({
            reason: message,
            error: e,
          });

          this.emitToListeners(errorMessage);
          return errorMessage;
        }
      }
    }

    if (handled) {
      const success = new SuccessMessage({
        reason: message,
      });
      this.emitToListeners(success);
      return success;
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

  ask = async <T extends Message>(
    message: T,
  ): Promise<{
    response: SuccessMessage | ErrorMessage;
    reason: T;
    error?: Error;
  }> => {
    const handlers = MessageHandlers.getHandlers(
      this.constructor,
      message.code,
    );

    if (!handlers || handlers.length === 0) {
      throw new AskNoHandlerError(message);
    }

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new AskTimeoutError(message, this.askTimeout));
      }, this.askTimeout);

      try {
        const response = (await this.handleMessage(message))!;

        clearTimeout(timeout);

        resolve({
          response,
          reason: response.reason! as T,
          error: isErrorMessage(response) ? response.error : undefined,
        });
      } catch (e) {
        reject(e);
      }
    });
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
