import { AppDetailsHelper, ApplicationConfigStarterBuilder } from './starter/core';
import { WebApplicationStarter, WebApplicationStarterBuilder } from './starter/web';
// import * as configs from './config';

export async function run(): Promise<WebApplicationStarter> {
  console.log(`App details: ${JSON.stringify(AppDetailsHelper.getDetails())}`);

  await ApplicationConfigStarterBuilder.create()
    // .addConfig(configs.serviceConfig)
    // .addConfig(configs.controllerConfig)
    // .addConfig(configs.routeConfig)
    .build()
    .initialize();

  return WebApplicationStarterBuilder
    // .defaultExpress(configs.routeConfig)
    .defaultExpress()
    .addRestApiErrorHandler()
    .build();
};
