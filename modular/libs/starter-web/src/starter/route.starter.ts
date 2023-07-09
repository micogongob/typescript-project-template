import express from 'express';

import * as utils from '../utils';

export interface RouteStarter {
  defineRoutes(router: express.Router): void;
}

export class SimpleHealthCheckRouteStarter implements RouteStarter {
  defineRoutes(router: express.Router): void {
    router.get('/', (req: express.Request, res: express.Response): express.Response => {
      res.header(utils.CONTENT_TYPE_HEADER, utils.APPLICATION_JSON_CONTENT_TYPE);
      return res.status(200).json(utils.HttpUtils.toSuccessfulResponse(
        { message: 'UP' }
      ));
    });
  }
}