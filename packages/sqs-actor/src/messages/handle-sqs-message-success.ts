import {
  Message,
  MessageArgs,
  RegisterMessage,
  SuccessMessage,
} from '@anyit/messaging';

type HandleSqsMessageSuccessArgs = MessageArgs<HandleSqsMessageSuccess>;

@RegisterMessage('01H7HZT51NX4ZXZCAQXC4HK6AB')
export class HandleSqsMessageSuccess extends SuccessMessage {
  constructor(args: HandleSqsMessageSuccessArgs) {
    super(args);

    this.receivedMessage = args.receivedMessage;
  }

  readonly receivedMessage: Message;
}

export const isHandleSqsMessageSuccess = (
  message?: Message,
): message is HandleSqsMessageSuccess =>
  Boolean(message && message.code === HandleSqsMessageSuccess.code);
