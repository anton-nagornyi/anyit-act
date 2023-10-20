import { MessageHandlers } from '../message-handlers';
import { MessageType } from '@anyit/messaging';

const destructArgs = function (args: any[]): [MessageType[], number] {
  if (args.length === 1) {
    const [arg] = args;
    if (arg.code) {
      return [[arg], 1];
    }

    return [arg.messageTypes, arg.parameterIndex];
  }
  return [args, 1];
};

export function ReasonFilter(...messageTypes: MessageType[]): MethodDecorator;
export function ReasonFilter(args: {
  messageTypes: MessageType[];
  parameterIndex: number;
}): MethodDecorator;

export function ReasonFilter(...args: any): MethodDecorator {
  const [messageTypes, parameterIndex] = destructArgs(args);

  return (target: any, propertyKey: string | symbol) => {
    messageTypes.forEach((messageType) => {
      MessageHandlers.setReasonChecker(target.constructor, {
        class: {
          name: target.constructor.name,
          method: propertyKey as string,
        },
        reason: {
          code: messageType.code,
          name: messageType.name,
          parameterIndex: parameterIndex,
        },
      } as const);
    });
  };
}
