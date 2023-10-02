import { Actor, ActorArgs, ActorRef, Subscribe } from '@anyit/actor';
import {
  ErrorMessage,
  isErrorMessage,
  isProcessingComplete,
  isSuccessMessage,
  Message,
  ProcessingComplete,
  SuccessMessage,
} from '@anyit/messaging';
import { MessageHandlers } from '@anyit/message-handling';
import { DeleteKey, Pattern } from '@anyit/key-value-actor';
import { LoggerInterface, SilentLogger } from '@anyit/logger-interface';

/** @internal */
export type MessageHandlingActorArgs = ActorArgs & {
  keyValue: ActorRef;
  wire: ActorRef;
  keyPrefix?: string;
  logger?: LoggerInterface;
};
export class MessageHandlingActor extends Actor {
  constructor(args: MessageHandlingActorArgs) {
    super(args);

    this.keyValue = args.keyValue;
    this.wire = args.wire;
    this.keyPrefix = args.keyPrefix ?? '';
    this.logger = args.logger ?? new SilentLogger();
  }

  private readonly logger: LoggerInterface;

  private readonly keyValue: ActorRef;

  private readonly wire: ActorRef;

  private readonly keyPrefix: string;

  start(ref: ActorRef) {
    this.wire.tell(
      new Subscribe({
        listener: ref,
        messageTypes: [SuccessMessage],
      }),
    );
  }

  protected async handleMessage(message: Message): Promise<void> {
    if (isSuccessMessage(message) && isProcessingComplete(message.reason)) {
      this.keyValue.tell(
        new DeleteKey({
          key: `${this.keyPrefix ? `${this.keyPrefix}*` : ''}${
            message.messageId
          }`,
          pattern: Pattern.glob,
        }),
      );

      return;
    }

    const handlers = MessageHandlers.getHandlers(message.code);

    if (handlers) {
      this.logger.info('[Messages]: processing message', message);

      for (const handler of handlers) {
        try {
          const result = await handler.handleFunction(message);
          if (isSuccessMessage(result) || isErrorMessage(result)) {
            this.wire.tell(result);
          }
        } catch (e: any) {
          this.wire.tell(
            new ErrorMessage({
              reason: message,
              error: e,
            }),
          );
        }
      }

      this.wire.tell(
        new ProcessingComplete({
          reason: message,
        }),
      );
    }
  }
}
