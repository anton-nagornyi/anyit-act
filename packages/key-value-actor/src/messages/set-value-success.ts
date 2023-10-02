import { Message, RegisterMessage } from '@anyit/messaging';
import { SetValue } from './set-value';

@RegisterMessage('01H7HR9KZR1SN74Y94C49F6BM5')
export class SetValueSuccess extends SetValue {}

export const isSetValueSuccess = (
  message?: Message,
): message is SetValueSuccess =>
  Boolean(message && message.code === SetValueSuccess.code);
