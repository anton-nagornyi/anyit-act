import { MessageType } from '@anyit/messaging';
import { MessageHandlers } from '../message-handlers';
import { getReceiveHandler } from '../get-receive-handler';

const destructArgs = function (args: any[]): [MessageType[], number] {
  if (args.length === 1) {
    const [arg] = args;
    if (arg.code) {
      return [[arg], 0];
    }

    return [arg.messageTypes, arg.parameterIndex];
  }
  return [args, 0];
};

export function ReceiveFilter(...messageTypes: MessageType[]): MethodDecorator;
export function ReceiveFilter(args: {
  messageTypes: MessageType[];
  parameterIndex: number;
}): MethodDecorator;

export function ReceiveFilter(...args: any): MethodDecorator {
  const [messageTypes, parameterIndex] = destructArgs(args);

  return (target: any, propertyKey: string | symbol) => {
    messageTypes.forEach((messageType) => {
      MessageHandlers.setHandler(target.constructor, {
        class: {
          name: target.constructor.name,
          method: propertyKey as string,
        },
        message: {
          code: messageType.code,
          name: messageType.name,
        },
        handleFunction: getReceiveHandler(
          target,
          propertyKey,
          parameterIndex,
          messageType,
        ),
      } as const);
    });
  };
}
