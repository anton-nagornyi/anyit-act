import { Actor } from '@anyit/actor';
import { HandleSqsMessage } from '../messages/handle-sqs-message';
import { ErrorMessage, MessageFactory } from '@anyit/messaging';
import { HandleSqsMessageSuccess } from '../messages/handle-sqs-message-success';
import { Receive } from '@anyit/message-handling';

export class SqsMessageHandlerActor extends Actor {
  handleSqsMessage(@Receive message: HandleSqsMessage) {
    const { sqsMessage, traceId } = message;

    const messageBody = JSON.parse(sqsMessage.Body || '{}');

    try {
      const receivedMessage = MessageFactory.create(messageBody);

      this.emitToListeners(
        new HandleSqsMessageSuccess({
          receivedMessage,
          traceId: traceId,
          reason: message,
        }),
      );
    } catch (error: any) {
      this.emitToListeners(
        new ErrorMessage({
          reason: message,
          error,
        }),
      );
    }
  }
}
