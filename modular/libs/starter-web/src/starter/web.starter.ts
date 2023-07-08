import express, { Application } from 'express';
import { Server } from 'http';
import debug from 'debug';

import * as middlewares from './middleware.starter';

const log = debug('app:server');

export class WebApplicationStarter {
  constructor(
    private app: Application
  ) {
    this.app = app;
  }

  addMiddleware(middelware: middlewares.MiddlewareStarter): void {
    middelware.configure(this.app);
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

  addMiddleware(middleware: middlewares.MiddlewareStarter): WebApplicationStarterBuilder {
    this.application.addMiddleware(middleware);
    return this;
  }

  build(): WebApplicationStarter {
    return this.application;
  }

  static newBuilder(app: Application): WebApplicationStarterBuilder {
    const builder = new WebApplicationStarterBuilder(new WebApplicationStarter(app));
    return builder;
  }

  static defaultExpress(): WebApplicationStarterBuilder {
    return this.newBuilder(express())
      .addMiddleware(new middlewares.HttpTrafficLoggingMiddlewareStarter())
      .addMiddleware(new middlewares.RequestBodyProcessingMiddlewareStarter())
      .addMiddleware(new middlewares.SimpleHealthCheckMiddlewareStarter())
      .addMiddleware(new middlewares.DefaultRouteNotFoundMiddlewareStarter())
  }
}

