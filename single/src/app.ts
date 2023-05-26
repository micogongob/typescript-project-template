import express from 'express';
import { errorHandler, AppDetailsHelper } from './utils';

export const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

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
