import debug from 'debug';
import { app } from './app';

const log = debug('app:server');
const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  log(`Server listening at port: ${port}`);
});