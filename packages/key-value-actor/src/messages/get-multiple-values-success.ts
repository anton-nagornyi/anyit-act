import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type GetMultipleValuesFailArgs = MessageArgs<GetMultipleValuesSuccess>;

@RegisterMessage('01H7HQ7HPPP9Z0EMM20CZRAS4G')
export class GetMultipleValuesSuccess extends Message {
  constructor(args: GetMultipleValuesFailArgs) {
    super(args);

    this.keyValues = { ...args.keyValues };
  }

  readonly keyValues: Record<string, string | Error>;
}

export const isGetMultipleValuesSuccess = (
  message?: Message,
): message is GetMultipleValuesSuccess =>
  Boolean(message && message.code === GetMultipleValuesSuccess.code);
