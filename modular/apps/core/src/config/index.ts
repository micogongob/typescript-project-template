// import { ConfigStarter, ConfigFieldGetter } from '@local/starter-core';
// import { RouteConfigStarter, RoutePathConfig, ErrorCodeMappingConfig } from '@local/starter-web';
// import { UserController } from '../controller';
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


// export class ControllerConfig implements ConfigStarter {
//   private userController: UserController | undefined;

//   constructor(
//     private serviceConfig: ServiceConfig
//   ) {
//     this.serviceConfig = serviceConfig;
//   }

//   async initialize(): Promise<void> {
//     this.userController = new UserController(
//       this.serviceConfig.getUserService()
//     )
//   }

//   getUserController(): UserController {
//     return ConfigFieldGetter.getRequiredField<UserController>(
//       this.userController,
//       'UserController'
//     );
//   }
// }


// export class RouteConfig implements RouteConfigStarter {
//   private userRoute: UserRoute | undefined;

//   constructor(
//     private controllerConfig: ControllerConfig
//   ) {
//     this.controllerConfig = controllerConfig
//   }

//   async initialize(): Promise<void> {
//     this.userRoute = new UserRoute(
//       this.controllerConfig.getUserController()
//     )
//   }

//   getUserRoute(): UserRoute {
//     return ConfigFieldGetter.getRequiredField<UserRoute>(
//       this.userRoute,
//       'UserRoute'
//     );
//   }

//   pathConfigs(): RoutePathConfig[] {
//     return [
//       {
//         route: this.getUserRoute(),
//         path: '/users'
//       }
//     ];
//   }
// }

// export const errorCodeMappingConfig: ErrorCodeMappingConfig = {
//   'ABC001': {
//     status: 400
//   }
// };
// export const serviceConfig = new ServiceConfig();
// export const controllerConfig = new ControllerConfig(serviceConfig);
// export const routeConfig = new RouteConfig(controllerConfig);