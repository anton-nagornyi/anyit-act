import {
  Actor,
  ActorArgs,
  ActorRef,
  ActorSystem,
  Subscribe,
} from '@anyit/actor';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import {
  ErrorMessage,
  ProcessingComplete,
  SuccessMessage,
} from '@anyit/messaging';
import { ReceiveArgs, StartPolling } from '../messages/start-polling';
import { SqsMessageHandlerActor } from './sqs-message-handler-actor';
import {
  HandleSqsMessage,
  isHandleSqsMessage,
} from '../messages/handle-sqs-message';
import { HandleSqsMessageSuccess } from '../messages/handle-sqs-message-success';
import { DuplicationCheckerActor } from './duplication-checker-actor';
import { StopPolling } from '../messages/stop-polling';
import { Receive } from '@anyit/message-handling';
import { MessageIsAlreadyReceived } from '../errors/message-is-already-received';
import { LoggerInterface, SilentLogger } from '@anyit/logger-interface';

type SQSClientArgs = NonNullable<ConstructorParameters<typeof SQSClient>[0]>;

export type SqsActorArgs = ActorArgs &
  SQSClientArgs & {
    queueUrl: string;
    duplicationCheck?: ActorRef<DuplicationCheckerActor>;
    logger?: LoggerInterface;
  };

export class SqsActor extends Actor {
  constructor(args: SqsActorArgs) {
    super(args);

    this.client = new SQSClient(args);

    this.queueUrl = args.queueUrl;

    this.duplication = args.duplicationCheck ?? ActorSystem.create(Actor);

    this.handler = ActorSystem.create(SqsMessageHandlerActor);

    this.logger = args.logger ?? new SilentLogger();
  }

  private receipts = new Map<string, string>();

  private readonly logger: LoggerInterface;

  private readonly client: SQSClient;

  private readonly queueUrl: string;

  private readonly handler!: ActorRef<SqsMessageHandlerActor>;

  private readonly duplication!: ActorRef<DuplicationCheckerActor>;

  private isPolling = false;

  private abortController?: AbortController;

  private pollingTimeout?: NodeJS.Timeout;

  start(ref: ActorRef) {
    this.handler.tell(
      new Subscribe({
        messageTypes: [HandleSqsMessageSuccess],
        listener: this.duplication,
      }),
    );

    this.duplication.tell(
      new Subscribe({
        messageTypes: [HandleSqsMessageSuccess],
        listener: ref,
      }),
    );
  }

  async processingComplete(@Receive message: ProcessingComplete) {
    if (message.reason) {
      const receipt = this.receipts.get(message.reason.messageId);

      if (receipt) {
        await this.client.send(
          new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receipt,
          }),
        );

        return new SuccessMessage({
          reason: message,
        });
      }
    }
  }

  handleSqsMessageSuccess(@Receive message: HandleSqsMessageSuccess) {
    if (isHandleSqsMessage(message.reason)) {
      this.receipts.set(
        message.receivedMessage.messageId,
        message.reason.sqsMessage.ReceiptHandle!,
      );
      this.emitToListeners(message);
    }
  }

  handleError(@Receive message: ErrorMessage) {
    if (message.error instanceof MessageIsAlreadyReceived) {
      this.logger.info(message.error.message);
    } else {
      this.logger.error(message.error);
    }
  }

  startPolling(@Receive message: StartPolling) {
    if (!this.isPolling) {
      const { receiveArgs } = message;
      this.isPolling = true;

      this.abortController = new AbortController();

      this.poll(this.abortController, receiveArgs);
    }
  }

  stopPolling(@Receive _: StopPolling) {
    if (this.isPolling) {
      this.logger.info('[SQS]: stopping to poll');

      this.isPolling = false;
      clearTimeout(this.pollingTimeout);
      this.abortController?.abort();
    }
  }

  poll = (abortController: AbortController, options?: ReceiveArgs) => {
    const {
      MaxNumberOfMessages = 10,
      WaitTimeSeconds = 20,
      MessageAttributeNames,
      AttributeNames,
      ReceiveRequestAttemptId,
      VisibilityTimeout,
    } = options || {};

    const loop = async () => {
      let pollingTimeout;

      try {
        pollingTimeout = 0;

        if (this.decideToPoll()) {
          const result = await this.client.send(
            new ReceiveMessageCommand({
              QueueUrl: this.queueUrl,
              AttributeNames,
              MaxNumberOfMessages,
              WaitTimeSeconds,
              MessageAttributeNames,
              ReceiveRequestAttemptId,
              VisibilityTimeout,
            }),
            { abortSignal: abortController.signal },
          );

          if (!this.decideToPoll()) {
            this.logger.info(
              `[SQS polling]: ${
                result.Messages?.length ?? 0
              } messages received after polling is stopped`,
            );
            return;
          }

          if (result.Messages) {
            for (const message of result.Messages) {
              await this.handler.tell(
                new HandleSqsMessage({
                  sqsMessage: message,
                }),
              );
            }
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          return;
        }

        // Exception may occur while connecting and reading from AWS. Wait 10 sec before the next attempt
        pollingTimeout = 10000;

        await this.emitToListeners(
          new ErrorMessage({
            error: e,
          }),
        );
      }

      if (pollingTimeout !== 0) {
        this.logger.info('[SQS]: pollingTimeout changed', {
          pollingTimeout,
        });
      }
      this.pollingTimeout = setTimeout(loop, pollingTimeout);
    };

    this.logger.info('[SQS]: polling started', {
      options: {
        QueueUrl: this.queueUrl,
        AttributeNames,
        MaxNumberOfMessages,
        WaitTimeSeconds,
        MessageAttributeNames,
        ReceiveRequestAttemptId,
        VisibilityTimeout,
      },
    });

    loop();
  };

  private decideToPoll() {
    return this.isPolling;
  }
}
