import { AppDetailsHelper } from '@local/common-dependencies';
import debug from 'debug';
import express from 'express';
import logger from 'morgan';

const log = debug('app:server');

export const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);