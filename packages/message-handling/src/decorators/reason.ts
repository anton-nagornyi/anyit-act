import 'reflect-metadata';
import { MessageHandlers } from '../message-handlers';

export const Reason = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const messageType = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )[parameterIndex];

  MessageHandlers.setReasonChecker(target.constructor, {
    class: {
      name: target.constructor.name,
      method: propertyKey as string,
    },
    reason: {
      code: messageType.code,
      name: messageType.name,
      parameterIndex,
    },
  } as const);
};
