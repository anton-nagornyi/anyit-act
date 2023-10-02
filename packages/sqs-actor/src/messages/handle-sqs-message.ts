import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { Message as SQSMessage } from '@aws-sdk/client-sqs';

type HandleSqsMessageArgs = MessageArgs<HandleSqsMessage> & {
  sqsMessage: SQSMessage;
};

@RegisterMessage('01H7HZCMN0JR8DV9WCWXS73AK0')
export class HandleSqsMessage extends Message {
  constructor(args: HandleSqsMessageArgs) {
    super(args);

    this.sqsMessage = args.sqsMessage;
  }

  readonly sqsMessage: SQSMessage;
}

export const isHandleSqsMessage = (
  message?: Message,
): message is HandleSqsMessage =>
  Boolean(message && message.code === HandleSqsMessage.code);
