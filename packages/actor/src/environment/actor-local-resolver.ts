import { Actor } from '../actor';
import { ActorResolver } from './actor-resolver';

export class ActorLocalResolver extends ActorResolver {
  private id = 0;

  private actors = new Map<string, Actor>();

  register(actor: Actor) {
    this.actors.set(actor.address, actor);
  }

  resolve<T extends Actor = Actor>(address: string): T | null {
    return (this.actors.get(address) as T) ?? null;
  }

  getNewAddress(address?: string): string {
    if (!address) {
      return `local:${++this.id}`;
    }

    if (!address.startsWith('local')) {
      return `local:${address}`;
    }

    return address;
  }
}
