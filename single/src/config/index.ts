// import { ConfigStarter, ConfigStarterUtils } from '../starter/core';
// import { RouteConfigStarter, RoutePathConfig, ErrorCodeMappingConfig } from '../starter/web';
// import { UserService } from '../service';
// import { UserController } from '../controller';
// import { UserRoute } from '../routes';

// export class ServiceConfig implements ConfigStarter {
//   private userService?: UserService;

//   constructor() {}

//   async initialize(): Promise<void> {
//     this.userService = new UserService();
//   }

//   getUserService(): UserService {
//     return ConfigStarterUtils.getRequiredField<UserService>(this.userService);
//   }
// }

// export class ControllerConfig implements ConfigStarter {
//   private userController?: UserController;

//   constructor(
//     private serviceConfig: ServiceConfig
//   ) {
//     this.serviceConfig = serviceConfig;
//   }

//   async initialize(): Promise<void> {
//     this.userController = new UserController(this.serviceConfig.getUserService());
//   }

//   getUserController(): UserController {
//     return ConfigStarterUtils.getRequiredField<UserController>(this.userController);
//   }
// }

// export class RouteConfig implements RouteConfigStarter {
//   private userRoute?: UserRoute;

//   constructor(
//     private controllerConfig: ControllerConfig
//   ) {
//     this.controllerConfig = controllerConfig;
//   }

//   async initialize(): Promise<void> {
//     this.userRoute = new UserRoute(this.controllerConfig.getUserController());
//   }

//   getUserRoute(): UserRoute {
//     return ConfigStarterUtils.getRequiredField<UserRoute>(this.userRoute);
//   }

//   pathConfigs(): RoutePathConfig[] {
//     return [
//       {
//         path: '/users',
//         route: this.getUserRoute()
//       }
//     ]
//   }
// }

// export const errorMapping: ErrorCodeMappingConfig = {
//   'ABC001': {
//     status: 400
//   }
// };
// export const serviceConfig = new ServiceConfig();
// export const controllerConfig = new ControllerConfig(serviceConfig);
// export const routeConfig = new RouteConfig(controllerConfig);