import { AppDetailsHelper } from '@local/common-dependencies';
import express from 'express';
import { ErrorHandler } from '@local/common-dependencies';
import {
  WebApplicationStarter,
  WebApplicationStarterBuilder,
  HttpTrafficLoggingMiddlewareStarter,
  RequestBodyProcessingMiddlewareStarter,
  SimpleHealthCheckMiddlewareStarter,
  DefaultRouteNotFoundMiddlewareStarter
} from '@local/starter-web';

export const app: WebApplicationStarter = WebApplicationStarterBuilder
  .newBuilder(express())
  .addMiddlewares(
    new HttpTrafficLoggingMiddlewareStarter(),
    new RequestBodyProcessingMiddlewareStarter(),
    new SimpleHealthCheckMiddlewareStarter(),
    new DefaultRouteNotFoundMiddlewareStarter()
  )
  .build();

// TODO support error handler in starter
//app.use(ErrorHandler.logError);
//app.use(ErrorHandler.asApiError);

console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);
