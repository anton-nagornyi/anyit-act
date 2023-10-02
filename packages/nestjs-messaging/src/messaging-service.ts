import { Injectable, Optional, Inject } from '@nestjs/common';
import { Message } from '@anyit/messaging';
import { ActorRef, ActorSystem, Subscribe } from '@anyit/actor';
import { MessageHandlingActor } from './message-handling-actor';
import { ANYIT_LOGGER, KEY_VALUE_ACTOR, WIRE_ACTOR } from './constants';
import { LoggerInterface, SilentLogger } from '@anyit/logger-interface';

@Injectable()
export class MessagingService {
  constructor(
    @Inject(WIRE_ACTOR)
    private readonly wire: ActorRef,

    @Inject(KEY_VALUE_ACTOR)
    private readonly keyValue: ActorRef,

    @Optional()
    @Inject(ANYIT_LOGGER)
    private readonly logger?: LoggerInterface,
  ) {
    const usedLogger = logger ?? new SilentLogger();
    const actor = ActorSystem.create(MessageHandlingActor, {
      wire,
      keyValue,
      logger: usedLogger,
    });

    wire.tell(
      new Subscribe({
        listener: actor,
      }),
    );
  }

  async tell(message: Message) {
    this.wire.tell(message);
  }
}
