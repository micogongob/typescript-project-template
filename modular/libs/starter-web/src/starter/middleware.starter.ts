import express from 'express';
import logger from 'morgan';

import { HttpBasedException } from '../errors';

export interface MiddlewareStarter {
  configure(app: express.Application): void;
}

export class HttpTrafficLoggingMiddlewareStarter implements MiddlewareStarter {
  configure(app: express.Application): void {
    if (process.env.NODE_ENV !== 'production') {
      app.use(logger('dev'));
    }
  }
}

export class RequestBodyProcessingMiddlewareStarter implements MiddlewareStarter {
  configure(app: express.Application): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
  }
}

export class DefaultRouteNotFoundMiddlewareStarter implements MiddlewareStarter {
  configure(app: express.Application): void {
    app.use((req: express.Request, res: express.Response): express.Response => {
      throw HttpBasedException.notFound(`Path: ${req.path} is not found.`);
    });
  }
}
