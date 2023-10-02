import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { ReceiveMessageCommandInput } from '@aws-sdk/client-sqs';

export type ReceiveArgs = Omit<ReceiveMessageCommandInput, 'QueueUrl'>;

export type StartPollingArgs = MessageArgs<StartPolling>;

@RegisterMessage('01H7HDGQ4PA42A02MDJEJSZE6Z')
export class StartPolling extends Message {
  constructor(args: StartPollingArgs) {
    super(args);

    this.receiveArgs = { ...args.receiveArgs };
  }

  readonly receiveArgs?: ReceiveArgs;
}
