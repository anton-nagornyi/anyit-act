import { ActorRef } from './actor-ref';
import type { Actor, ActorArgs } from './actor';
import { EnvironmentManager } from './environment/environment-manager';

type HasFields<T> = T extends ActorArgs
  ? keyof T extends keyof ActorArgs
    ? true
    : false
  : false;

type IsActorArgs<T extends ActorArgs> = HasFields<T>;

type Args<T extends typeof Actor> = ConstructorParameters<T>[0];

type ResultArgs<T extends typeof Actor> = Omit<
  ConstructorParameters<T>[0],
  'address'
> & { address?: string; askTimeout?: number };

export type ActorSystemSettings = {
  askTimeout: number;
  manager: EnvironmentManager;
};

export class ActorSystem {
  private static settings: ActorSystemSettings = {
    askTimeout: 100000,
    manager: new EnvironmentManager(),
  };

  static set(settings: Partial<ActorSystemSettings>) {
    this.settings = { ...this.settings, ...settings };
  }

  static resolve(address: string): ActorRef | null {
    const env = this.getEnvironment(address);
    const envAddress = env.resolver.getNewAddress(address);

    const actor = env.resolver.resolve(envAddress);
    if (!actor) {
      return null;
    }
    return new ActorRef(envAddress, env.transmitter);
  }

  static getRef(address: string): ActorRef {
    const env = this.getEnvironment(address);
    const envAddress = env.resolver.getNewAddress(address);

    return new ActorRef(envAddress, env.transmitter);
  }

  static create<T extends typeof Actor = typeof Actor>(
    actor: T,
    ...args: IsActorArgs<Args<T>> extends true ? [Args<T>?] : [ResultArgs<T>]
  ): ActorRef {
    const [firstArg] = args;

    const { address: inputAddress, ...restArgs } =
      firstArg ??
      ({
        address: null,
      } as any);

    const env = this.getEnvironment(inputAddress);

    const address = env.resolver.getNewAddress(inputAddress);

    const newActor = new actor({
      address,
      askTimeout: this.settings.askTimeout,
      ...restArgs,
    });

    env.resolver.register(newActor);

    const ref = new ActorRef(address, env.transmitter);

    newActor.start(ref);

    return ref;
  }

  private static getEnvironment(address?: string) {
    return this.settings.manager.getEnvironmentByAddress(address);
  }
}
