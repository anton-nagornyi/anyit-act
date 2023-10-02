import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type GetMultipleValuesArgs = MessageArgs<GetMultipleValues>;

@RegisterMessage('01H7HQ16V5Q07M7ENNS3DBBT91')
export class GetMultipleValues extends Message {
  constructor(args: GetMultipleValuesArgs) {
    super(args);

    this.keys = [...args.keys];
  }

  readonly keys: ReadonlyArray<string>;
}

export const isGetMultipleValues = (
  message?: Message,
): message is GetMultipleValues =>
  Boolean(message && message.code === GetMultipleValues.code);
