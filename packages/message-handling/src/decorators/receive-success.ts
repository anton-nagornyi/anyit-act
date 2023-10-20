import { SuccessMessage } from '@anyit/messaging';
import 'reflect-metadata';
import { MessageHandlers } from '../message-handlers';
import { getReceiveHandler } from '../get-receive-handler';

export const ReceiveSuccess = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const messageType = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )[parameterIndex];

  const method = propertyKey as string;

  const className = target.constructor.name;

  MessageHandlers.setHandler(target.constructor, {
    class: {
      name: className,
      method,
    },
    message: {
      code: SuccessMessage.code,
      name: SuccessMessage.name,
    },
    handleFunction: getReceiveHandler(
      target,
      propertyKey,
      parameterIndex,
      SuccessMessage,
      messageType,
    ),
  } as const);
};
