import { Message } from './message';
import { RegisterMessage } from '../decorators/register-message';

@RegisterMessage('01H81549TN9GVH5NGBAPFK8TVZ')
export class ProcessingComplete extends Message {}

export const isProcessingComplete = (
  message?: Message,
): message is ProcessingComplete =>
  Boolean(message && message.code === ProcessingComplete.code);
