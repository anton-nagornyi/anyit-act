import { MessageFactory } from '../message-factory';
import { MessageType } from '../messages/message';
import { CODE } from '../symbols/internal-symbols';

export const RegisterMessage =
  (uniqueCode?: string) =>
  <T extends MessageType>(target: T) => {
    const code = uniqueCode ?? target.name;
    MessageFactory.register(code, target);

    (target as any)[CODE] = code;

    return target as T;
  };
