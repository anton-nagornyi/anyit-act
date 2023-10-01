import { Environment } from './environment';
import { ActorLocalResolver } from './actor-local-resolver';
import { LocalTransmitter } from './local-transmitter';

export class LocalEnvironment extends Environment {
  constructor() {
    const resolver = new ActorLocalResolver();
    const transmitter = new LocalTransmitter(resolver);
    super('local', resolver, transmitter);
  }
}
