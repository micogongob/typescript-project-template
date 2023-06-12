import { debug as Debug } from 'debug';
import { app } from './app';

const debug = Debug('app');
const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  debug(`Server listening at port: ${port}`);
});
