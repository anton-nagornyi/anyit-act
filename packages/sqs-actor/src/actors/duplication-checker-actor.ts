import { Actor, ActorArgs, ActorRef, Subscribe } from '@anyit/actor';
import {
  HandleSqsMessageSuccess,
  isHandleSqsMessageSuccess,
} from '../messages/handle-sqs-message-success';
import {
  GetValue,
  GetValueSuccess,
  isGetValue,
  KeyValueActor,
} from '@anyit/key-value-actor';
import { randomUUID } from 'crypto';
import { ErrorMessage } from '@anyit/messaging';
import { MessageIsAlreadyReceived } from '../errors/message-is-already-received';
import { Receive } from '@anyit/message-handling';

type DuplicationCheckerActorArgs = ActorArgs & {
  keyValue: ActorRef<KeyValueActor>;
  prefix?: string;
};

export class DuplicationCheckerActor extends Actor {
  constructor(args: DuplicationCheckerActorArgs) {
    super(args);

    this.keyValue = args.keyValue;
    this.prefix = args.prefix ?? randomUUID();
  }

  private readonly keyValue: ActorRef<KeyValueActor>;

  private readonly prefix: string;

  start(ref: ActorRef) {
    this.keyValue.tell(
      new Subscribe({
        listener: ref,
        messageTypes: [ErrorMessage, GetValueSuccess],
      }),
    );
  }

  handleSqsMessageSuccess(@Receive message: HandleSqsMessageSuccess) {
    const { traceId, messageId } = message;

    this.keyValue.tell(
      new GetValue({
        traceId: traceId,
        reason: message,
        key: `${this.prefix}:${messageId}`,
      }),
    );
  }

  getValueFail(@Receive message: ErrorMessage) {
    if (
      message.reason &&
      isGetValue(message.reason) &&
      isHandleSqsMessageSuccess(message.reason.reason)
    ) {
      this.emitToListeners(message.reason.reason);
    }
  }

  getValueSuccess(@Receive message: GetValueSuccess) {
    const { reason, traceId } = message;
    if (isHandleSqsMessageSuccess(reason)) {
      this.emitToListeners(
        new ErrorMessage({
          traceId: traceId,
          reason,
          error: new MessageIsAlreadyReceived(reason.messageId),
        }),
      );
    }
  }
}
