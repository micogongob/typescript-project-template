import express, { Application } from 'express';
import { Server } from 'http';
import debug from 'debug';

import {
  MiddlewareStarter,
  HttpTrafficLoggingMiddlewareStarter,
  RequestBodyProcessingMiddlewareStarter,
  SimpleHealthCheckMiddlewareStarter
} from './middleware.starter';

const log = debug('app:server');

export class WebApplicationStarter {
  constructor(
    private app: Application
  ) {
    this.app = app;
  }

  addMiddleware(middleware: MiddlewareStarter): void {
    middleware.configure(this.app);
  }

  start(port: string | number): Server {
    return this.app.listen(port, () => {
      log(`Server listening at port: ${port}`);
    });
  }
}

export class WebApplicationStarterBuilder {

  private constructor(
    private application: WebApplicationStarter
  ) {
    this.application = application;
  }

  addMiddlewares(...middlewares: MiddlewareStarter[]): WebApplicationStarterBuilder {
    for (const m of middlewares) {
      this.application.addMiddleware(m);
    }
    return this;
  }

  build(): WebApplicationStarter {
    return this.application;
  }

  static newBuilder(app: Application): WebApplicationStarterBuilder {
    const builder = new WebApplicationStarterBuilder(new WebApplicationStarter(app));
    return builder;
  }
}

// export const webApp: WebApplicationStarter = WebApplicationStarterBuilder
//   .newBuilder(express())
//   .addMiddlewares(
//     new HttpTrafficLoggingMiddlewareStarter(),
//     new RequestBodyProcessingMiddlewareStarter(),
//     new SimpleHealthCheckMiddlewareStarter()
//   )
//   .build();

