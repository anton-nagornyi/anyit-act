import { Actor, ActorArgs } from '@anyit/actor';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Message } from '@anyit/messaging';

type SNSClientArgs = NonNullable<ConstructorParameters<typeof SNSClient>[0]>;

export type SnsActorProps = ActorArgs & SNSClientArgs & { topic: string };

export class SnsActor extends Actor {
  private readonly client: SNSClient;

  constructor(props: SnsActorProps) {
    super(props);

    this.client = new SNSClient(props);

    this.topic = props.topic;
  }

  private readonly topic: string;

  protected async handleMessage(message: Message): Promise<void> {
    await this.client.send(
      new PublishCommand({
        TopicArn: this.topic,
        Message: JSON.stringify(message),
      }),
    );
    await super.handleMessage(message);
  }
}
