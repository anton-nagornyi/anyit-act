import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type GetValueSuccessArgs = MessageArgs<GetValueSuccess>;

@RegisterMessage('01H7HPGPP7B1R8AN548C3QFZ72')
export class GetValueSuccess extends Message {
  constructor(args: GetValueSuccessArgs) {
    super(args);

    this.key = args.key;
    this.value = args.value;
  }

  readonly key: string;

  readonly value: string;
}

export const isGetValueSuccess = (
  message?: Message,
): message is GetValueSuccess =>
  Boolean(message && message.code === GetValueSuccess.code);
