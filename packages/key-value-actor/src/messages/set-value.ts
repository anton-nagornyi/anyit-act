import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { KeyValueStoreOptions } from '../store/key-value-store-options';

type SetValueMessageArgs = MessageArgs<SetValue>;

@RegisterMessage('01H7HFD54Q4W3ZRF3WCQPFCGX9')
export class SetValue extends Message {
  constructor(args: SetValueMessageArgs) {
    super(args);

    this.key = args.key;
    this.value = args.value;
    this.options = { ...args.options };
  }

  readonly key: string;

  readonly value: string;

  readonly options?: KeyValueStoreOptions;
}

export const isSetValue = (message?: Message): message is SetValue =>
  Boolean(message && message.code === SetValue.code);
