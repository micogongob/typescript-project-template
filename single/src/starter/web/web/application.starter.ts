import express from 'express';
import { Server } from 'http';
import debug from 'debug';

import * as types from '../types';
import * as middlewares from './middleware.starter';
import * as routes from './route.starter';
import * as errorHandlers  from './error-handler.starter';

const log = debug('app:server');

export class WebApplicationStarter {

  constructor(
    private app: express.Application
  ) {
    this.app = app;
  }

  addMiddleware(middelware: middlewares.MiddlewareStarter): void {
    middelware.configure(this.app);
  }

  addRoute(path: string, route: routes.RouteStarter): void {
    const router = express.Router();
    route.defineRoutes(router);
    this.app.use(path, router);
  }

  addErrorHandler(errorHandler: errorHandlers.ErrorHandlerStarter): void {
    this.app.use(errorHandler.buildErrorHandler());
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

  addRoute(path: string, route: routes.RouteStarter): WebApplicationStarterBuilder {
    this.application.addRoute(path, route);
    return this;
  }

  addErrorHandler(handler: errorHandlers.ErrorHandlerStarter): WebApplicationStarterBuilder {
    this.application.addErrorHandler(handler);
    return this;
  }

  addRestApiErrorHandler(mappingConfig: types.ErrorCodeMappingConfig = {}): WebApplicationStarterBuilder {
    this.application.addErrorHandler(new errorHandlers.DefaultErrorToRestResponseErrorHandler(mappingConfig));
    return this;
  }

  build(): WebApplicationStarter {
    return this.application;
  }

  static newBuilder(app: express.Application): WebApplicationStarterBuilder {
    const builder = new WebApplicationStarterBuilder(new WebApplicationStarter(app));
    return builder;
  }

  static defaultExpress(
    routeConfig: routes.RouteConfigStarter | null = null
  ): WebApplicationStarterBuilder {
    const builder = this.newBuilder(express())
      .addMiddleware(new middlewares.HttpTrafficLoggingMiddlewareStarter())
      .addMiddleware(new middlewares.RequestBodyProcessingMiddlewareStarter())
      .addRoute('/health', new routes.SimpleHealthCheckRouteStarter());

    if (routeConfig !== null) {
      for (const config of routeConfig.pathConfigs()) {
        builder.addRoute(config.path, config.route);
      }
    }

    builder.addMiddleware(new middlewares.DefaultRouteNotFoundMiddlewareStarter());

    builder.addErrorHandler(new errorHandlers.DefaultConsoleLoggingErrorHandlerStarter());

    return builder;
  }
}
