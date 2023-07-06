import debug from 'debug';
import { app } from './app';

const log = debug('app');
const port = process.env.PORT || 3000;

export const server = app.start(port);
