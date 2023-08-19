import { Message } from './message';
import { RegisterMessage } from '../decorators/register-message';

@RegisterMessage('01H83DTGF2JXXGJ96B4P1B9FNZ')
export class SuccessMessage extends Message {}

export const isSuccessMessage = (
  message?: Message | void,
): message is SuccessMessage =>
  Boolean(
    message &&
      (message.code === SuccessMessage.code ||
        message instanceof SuccessMessage),
  );
