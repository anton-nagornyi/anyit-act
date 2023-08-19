import { Message } from '@anyit/messaging';
import 'reflect-metadata';
import { MessageHandlers } from '../message-handlers';

export const Receive = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const originalMethod = target[propertyKey];

  const messageType = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )[parameterIndex];

  MessageHandlers.setHandler(target.constructor, {
    class: {
      name: target.constructor.name,
      method: propertyKey as string,
    },
    message: {
      code: messageType.code,
      name: messageType.name,
    },
    handleFunction: function (message: Message) {
      const args = [];
      args[parameterIndex] = message;
      return originalMethod.apply(this, args);
    },
  } as const);
};
