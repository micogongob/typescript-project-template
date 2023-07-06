import express from 'express';
import logger from 'morgan';

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
      return res.status(200).json({
        data: {
          message: 'OK'
        }
      });
    });
  }
}
