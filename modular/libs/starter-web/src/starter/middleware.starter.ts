import express from 'express';
import logger from 'morgan';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

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

export class SimpleHealthCheckMiddlewareStarter implements MiddlewareStarter {
  configure(app: express.Application): void {
    app.get('/health', (req: express.Request, res: express.Response): express.Response => {
      res.header(CONTENT_TYPE, APPLICATION_JSON);
      return res.status(200).json({
        data: {
          status: '200 OK',
          message: 'OK'
        }
      });
    });
  }
}

export class DefaultRouteNotFoundMiddlewareStarter implements MiddlewareStarter {
  configure(app: express.Application): void {
    app.use((req: express.Request, res: express.Response): express.Response => {
      res.header(CONTENT_TYPE, APPLICATION_JSON);
      return res.status(404).json({
        error: {
          status: '404 Not Found',
          message: `Path: ${req.path} is not found`
        }
      });
    });
  }
}