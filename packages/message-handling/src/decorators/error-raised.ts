import 'reflect-metadata';
import { MessageHandlers } from '../message-handlers';

export const ErrorRaised = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  const errorType = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  )[parameterIndex];

  MessageHandlers.setErrorChecker(target.constructor, {
    class: {
      name: target.constructor.name,
      method: propertyKey as string,
    },
    error: errorType,
    parameterIndex,
  } as const);
};
