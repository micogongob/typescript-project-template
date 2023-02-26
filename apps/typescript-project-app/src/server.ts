import { AppDetailsHelper } from '@local/commons';
import express from 'express';

const app = express();

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

console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
