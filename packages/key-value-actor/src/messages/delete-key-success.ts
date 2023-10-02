import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type DeleteKeySuccessArgs = MessageArgs<DeleteKeySuccess>;

@RegisterMessage('01H7HQRV170M54BKV2RGGAFXBY')
export class DeleteKeySuccess extends Message {
  constructor(args: DeleteKeySuccessArgs) {
    super(args);

    this.key = args.key;
  }

  readonly key: string;
}

export const isDeleteKeySuccess = (
  message?: Message,
): message is DeleteKeySuccess =>
  Boolean(message && message.code === DeleteKeySuccess.code);
