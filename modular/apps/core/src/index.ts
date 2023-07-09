import { Server } from 'http';

import { run } from './app';

const port = process.env.PORT || 3000;

export const server: Promise<Server>
  = run().then((app) => app.start(port));