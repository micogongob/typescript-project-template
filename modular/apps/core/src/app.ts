import { AppDetailsHelper } from '@local/common-dependencies';
import { ErrorHandler } from '@local/common-dependencies';
import {
  WebApplicationStarter,
  WebApplicationStarterBuilder
} from '@local/starter-web';

export const app: WebApplicationStarter = WebApplicationStarterBuilder
  .defaultExpress()
  .build();

// TODO support error handler in starter
//app.use(ErrorHandler.logError);
//app.use(ErrorHandler.asApiError);

console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);
