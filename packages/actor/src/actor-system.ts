import { ActorRef } from './actor-ref';
import type { Actor, ActorArgs } from './actor';
import { EnvironmentManager } from './environment/environment-manager';
import { LocalEnvironment } from './environment/local-environment';

type IsActorArgs<T extends ActorArgs> = keyof T extends 'address'
  ? T['address'] extends string
    ? keyof T extends keyof ActorArgs
      ? true
      : false
    : false
  : false;

type Args<T extends typeof Actor> = ConstructorParameters<T>[0];

type ResultArgs<T extends typeof Actor> = Omit<
  ConstructorParameters<T>[0],
  'address'
> & { address?: string };

export class ActorSystem {
  private static localEnvironment = new LocalEnvironment();

  private static envManager = new EnvironmentManager([this.localEnvironment]);

  static resolve<T extends Actor = Actor>(address: string): ActorRef<T> | null {
    const env = this.getEnvironment(address);
    const envAddress = env.resolver.getNewAddress(address);

    const actor = env.resolver.resolve<T>(envAddress);
    if (!actor) {
      return null;
    }
    return new ActorRef<T>(envAddress, env.transmitter);
  }

  static getRef<T extends Actor = Actor>(address: string): ActorRef<T> {
    const env = this.getEnvironment(address);
    const envAddress = env.resolver.getNewAddress(address);

    return new ActorRef<T>(envAddress, env.transmitter);
  }

  static create<T extends typeof Actor = typeof Actor>(
    actor: T,
    ...args: IsActorArgs<Args<T>> extends true ? [{}?] : [ResultArgs<T>]
  ): ActorRef<InstanceType<T>> {
    const [firstArg] = args;

    const { address: inputAddress, ...restArgs } =
      firstArg ??
      ({
        address: null,
      } as any);

    const env = this.getEnvironment(inputAddress);

    const address = env.resolver.getNewAddress(inputAddress);

    const newActor = new actor({ address, ...restArgs });

    env.resolver.register(newActor);

    const ref = new ActorRef<InstanceType<T>>(address, env.transmitter);

    newActor.start(ref);

    return ref;
  }

  private static getEnvironment(address?: string) {
    return (
      this.envManager.getEnvironmentByAddress(address) ?? this.localEnvironment
    );
  }
}
