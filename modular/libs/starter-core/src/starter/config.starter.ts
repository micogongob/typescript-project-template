export interface ConfigStarter {
  initialize(): Promise<void>;
}

export class ApplicationConfigStarter {
  private configs: ConfigStarter[];

  constructor() {
    this.configs = [];
  }

  addConfig(config: ConfigStarter): void {
    this.configs.push(config);
  }

  async initialize(): Promise<void> {
    for (const c of this.configs) {
      await c.initialize();
    }
  }
}

export class ApplicationConfigStarterBuilder {
  private constructor(
    private appConfig: ApplicationConfigStarter
  ) {
    this.appConfig = appConfig;
  }

  addConfig(config: ConfigStarter): ApplicationConfigStarterBuilder {
    this.appConfig.addConfig(config);
    return this;
  }

  build(): ApplicationConfigStarter {
    return this.appConfig;
  }

  static create(): ApplicationConfigStarterBuilder {
    const builder = new ApplicationConfigStarterBuilder(
      new ApplicationConfigStarter()
    );
    return builder;
  }
}