import { MessageFactory } from '../message-factory';
import { MessageType } from '../messages/message';
import { CODE } from '../symbols/internal-symbols';

export const RegisterMessage =
  (uniqueCode: string) =>
  <T extends MessageType>(target: T) => {
    MessageFactory.register(uniqueCode, target);

    (target as any)[CODE] = uniqueCode;

    return target as T;
  };
