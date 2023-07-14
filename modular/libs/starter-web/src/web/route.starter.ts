import express from 'express';

import { ConfigStarter } from '@local/starter-core';
import {
  RoutePathConfig
} from '../types';
import * as utils from '../utils';

export interface RouteStarter {
  defineRoutes(router: express.Router): void;
}

export interface RouteConfigStarter extends ConfigStarter {
  pathConfigs(): RoutePathConfig[];
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

export function asyncHandler(
  action: (arg0: express.Request, arg1: express.Response) => Promise<express.Response>
): (arg0: express.Request, arg1: express.Response, arg2: express.NextFunction) => Promise<express.Response | void> {
  return async (req, res, next) => {
    try {
      return await action(req, res);
    } catch (err) {
      return next(err);
    }
  };
}

export function syncHandler(
  action: (arg0: express.Request, arg1: express.Response) => express.Response
): (arg0: express.Request, arg1: express.Response, arg2: express.NextFunction) => express.Response | void {
  return (req, res, next) => {
    try {
      return action(req, res);
    } catch (err) {
      return next(err);
    }
  };
}