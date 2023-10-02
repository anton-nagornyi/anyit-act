import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type GetValueArgs = MessageArgs<GetValue>;

@RegisterMessage('01H7HNVKZJ37JA33YWTQNJ3GR8')
export class GetValue extends Message {
  constructor(args: GetValueArgs) {
    super(args);

    this.key = args.key;
  }

  readonly key: string;
}

export const isGetValue = (message?: Message): message is GetValue =>
  Boolean(message && message.code === GetValue.code);
