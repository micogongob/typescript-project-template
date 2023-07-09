// import { ConfigStarter, ConfigFieldGetter } from '@local/starter-core';
// import { RouteConfigStarter, RoutePathConfig, ErrorCodeMappingConfig } from '@local/starter-web';
// import { UserRoute } from '../routes';
// import { UserService } from '../service';

// export class ServiceConfig implements ConfigStarter {
//   private userService?: UserService;

//   async initialize(): Promise<void> {
//     this.userService = new UserService();
//   }

//   getUserService(): UserService {
//     return ConfigFieldGetter.getRequiredField<UserService>(
//       this.userService,
//       'UserService'
//     );
//   }
// }


// export class RouteConfig implements RouteConfigStarter {
//   private userRoute: UserRoute | undefined;

//   constructor(
//     private serviceConfig: ServiceConfig
//   ) {
//     this.serviceConfig = serviceConfig
//   }

//   async initialize(): Promise<void> {
//     this.userRoute = new UserRoute(
//       this.serviceConfig.getUserService()
//     )
//   }

//   pathConfigs(): RoutePathConfig[] {
//     return [
//       {
//         route: this.getUserRoute(),
//         path: '/users'
//       }
//     ];
//   }

//   getUserRoute(): UserRoute {
//     return ConfigFieldGetter.getRequiredField<UserRoute>(
//       this.userRoute,
//       'UserRoute'
//     );
//   }
// }

// export const errorCodeMappingConfig: ErrorCodeMappingConfig = {
//   'ABC001': {
//     status: 400
//   }
// };
// export const serviceConfig = new ServiceConfig();
// export const routeConfig = new RouteConfig(serviceConfig);