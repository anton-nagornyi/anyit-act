import { isErrorMessage, Message, MessageType } from '@anyit/messaging';
import { MessageHandlers } from './message-handlers';
import { ReasonChecker } from './reason-checker';
import { ErrorChecker } from './error-checker';

const getReasonParameterIndex = (
  reasonCheckers?: ReasonChecker[],
  code?: string,
) => {
  if (!reasonCheckers) {
    return;
  }

  if (!code) {
    return -1;
  }

  for (const reasonChecker of reasonCheckers) {
    if (code === reasonChecker.reason.code) {
      return reasonChecker.reason.parameterIndex ?? -1;
    }
  }

  return -1;
};

const getErrorParameterIndex = (
  errorCheckers?: ErrorChecker[],
  message?: Message,
) => {
  if (!isErrorMessage(message)) {
    return;
  }

  const { error } = message;
  if (!error || !errorCheckers) {
    return;
  }
  for (const errorChecker of errorCheckers) {
    const errorCode = (error as any).code;
    if (
      error.constructor === errorChecker.error ||
      (errorCode && errorCode === (errorChecker.error as any).code)
    ) {
      return errorChecker.parameterIndex ?? -1;
    }
  }

  return -1;
};

export function getReceiveHandler(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
  messageType: MessageType,
  receiveReason?: MessageType,
) {
  const originalMethod = target[propertyKey];

  const method = propertyKey as string;

  const className = target.constructor.name;

  return async function (message: Message) {
    const useMessage = receiveReason ? message.reason : message;
    const useMessageType = receiveReason ?? messageType;

    if (useMessage?.code !== useMessageType.code) {
      return;
    }

    const reasonCheckers = MessageHandlers.getReasonChecker(
      target.constructor,
      method,
    );

    const errorCheckers = MessageHandlers.getErrorCheckers(
      target.constructor,
      method,
    );

    const reasonParameterIndex = getReasonParameterIndex(
      reasonCheckers,
      useMessage.reason?.code,
    );
    const canHandleReason = reasonParameterIndex !== -1;

    const errorParameterIndex = getErrorParameterIndex(errorCheckers, message);
    const canHandleError = errorParameterIndex !== -1;

    const canHandle = canHandleReason && canHandleError;

    if (canHandle) {
      const args = [];
      args[parameterIndex] = useMessage;

      if (canHandleReason && reasonParameterIndex !== undefined) {
        args[reasonParameterIndex] = useMessage.reason;
      }

      if (
        canHandleError &&
        isErrorMessage(message) &&
        errorParameterIndex !== undefined
      ) {
        args[errorParameterIndex] = message.error;
      }

      await MessageHandlers.events.emit('beforeHandling', useMessage, {
        class: className,
        method: propertyKey as string,
      });

      // @ts-ignore
      const result = await originalMethod.apply(this, args);

      try {
        await MessageHandlers.events.emit('afterHandling', useMessage, {
          class: className,
          method: propertyKey as string,
        });
      } catch (e) {
        // This is intentional
      }

      return result;
    }
  };
}
