import { Environment } from './environment';
import { LocalEnvironment } from './local-environment';

export class EnvironmentManager {
  constructor(private readonly environments: Environment[] = []) {}

  private localEnvironment = new LocalEnvironment();

  getEnvironmentByAddress(address?: string | null) {
    if (!address) {
      return this.localEnvironment;
    }

    const [name] = address.split(':');
    return this.getEnvironmentByName(name);
  }

  getEnvironmentByName(name: string) {
    for (const env of this.environments) {
      if (env.name === name) {
        return env;
      }
    }
    return this.localEnvironment;
  }
}
