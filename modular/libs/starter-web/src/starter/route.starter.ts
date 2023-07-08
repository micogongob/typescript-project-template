import express from 'express';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

export interface RouteStarter {
  defineRoutes(router: express.Router): void;
}

export class SimpleHealthCheckRouteStarter implements RouteStarter {
  defineRoutes(router: express.Router): void {
    router.get('/', (req: express.Request, res: express.Response): express.Response => {
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