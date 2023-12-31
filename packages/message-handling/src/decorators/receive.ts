import { MessageHandlers } from '../message-handlers';
import { getReceiveHandler } from '../get-receive-handler';

export const Receive = (
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
};
