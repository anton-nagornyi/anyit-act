import { Actor } from '../actor';

export abstract class ActorResolver {
  abstract getNewAddress(address?: string): string;

  abstract register(actor: Actor): void;

  abstract resolve<T extends Actor = Actor>(address: string): T | null;
}
