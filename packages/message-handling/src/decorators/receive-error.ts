import { ErrorMessage } from '@anyit/messaging';
import 'reflect-metadata';
import { MessageHandlers } from '../message-handlers';
import { getReceiveHandler } from '../get-receive-handler';

export const ReceiveError = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const messageType = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )[parameterIndex];

  const className = target.constructor.name;

  MessageHandlers.setHandler(target.constructor, {
    class: {
      name: className,
      method: propertyKey as string,
    },
    message: {
      code: ErrorMessage.code,
      name: ErrorMessage.name,
    },

    handleFunction: getReceiveHandler(
      target,
      propertyKey,
      parameterIndex,
      ErrorMessage,
      messageType,
    ),
  } as const);
};
