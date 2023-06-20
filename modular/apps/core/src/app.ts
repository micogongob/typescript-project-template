import { AppDetailsHelper } from '@local/commons';
import express from 'express';
import logger from 'morgan';
import { errorHandler } from '@local/commons';

export const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: any, res: any, next: any) => {
  try {
    return res.status(200).end();
  } catch (err) {
    return next(err);
  }
});

app.get('/health', (req: any, res: any, next: any) => {
  try {
    return res.status(200).json({
      data: {
        message: 'OK'
      }
    });
  } catch (err) {
    return next(err);
  }
});

app.use(errorHandler.logError);
app.use(errorHandler.asApiError);

console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);
