import express from 'express';
import { RouteStarter } from './starter';

export type RoutePathConfig = {
  route: RouteStarter;
  path: string;
}

export type BaseHttpResponse = {
  status: number;
  statusText: string;
};

export type SuccessfulResponse = {
  data: any
} & BaseHttpResponse;

export type FailedResponse = {
  errors: any[];
} & BaseHttpResponse;

export type HttpErrorResult = {
  status: number;
  errors: any[];
}

export type ValidatorFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => express.Response | void;

export type ErrorHandlerFunction = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => express.Response | void;

export type ErrorCodeInfo = {
  status: number;
  message?: string;
};

export type ErrorCodeMappingConfig = Record<string, ErrorCodeInfo>;