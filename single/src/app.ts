import express from 'express';
import logger from 'morgan';
import { ErrorHandler, AppDetailsHelper } from './utils';

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

app.use(ErrorHandler.logError);
app.use(ErrorHandler.asApiError);

console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);
