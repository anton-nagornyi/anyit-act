import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { Pattern } from '../store/pattern';

type DeleteKeyMessageArgs = MessageArgs<DeleteKey>;

@RegisterMessage('01H7HNTT08AS2M7NAPQQNMHRQ2')
export class DeleteKey extends Message {
  constructor(args: DeleteKeyMessageArgs) {
    super(args);

    this.key = args.key;

    this.pattern = args.pattern;
  }

  readonly key: string;

  readonly pattern?: Pattern;
}

export const isDeleteKey = (message?: Message): message is DeleteKey =>
  Boolean(message && message.code === DeleteKey.code);
