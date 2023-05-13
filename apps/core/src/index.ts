import { app } from './app';

const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
