import { Actor, ActorArgs, ActorRef, isSubscribeMessage } from '@anyit/actor';
import { isProcessingComplete, Message } from '@anyit/messaging';

export type WireActorArgs = ActorArgs & {
  writer: ActorRef;
  readers: ActorRef[];
};

export class WireActor extends Actor {
  constructor(args: WireActorArgs) {
    super(args);

    this.readers = [...args.readers];
    this.writer = args.writer;
  }

  private readonly writer: ActorRef;

  private readonly readers: ActorRef[];

  protected async handleMessage(message: Message): Promise<void> {
    if (isProcessingComplete(message) || isSubscribeMessage(message)) {
      this.tellReaders(message);
    } else {
      this.writer.tell(message);
    }
  }

  private tellReaders(message: Message) {
    for (const reader of this.readers) {
      reader.tell(message);
    }
  }
}
