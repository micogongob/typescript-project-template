import { AppDetails } from '../types';
import { BaseEnvHelper } from './base-env.helper';

export class AppDetailsHelper {
  private static APP_DETAILS: AppDetails;

  static {
    this.APP_DETAILS = {
      name: BaseEnvHelper.getOptionalStringOrDefault('APP_NAME', 'UNKNOWN_APP_NAME'),
      version: BaseEnvHelper.getOptionalStringOrDefault('APP_VERSION', 'UNKNOWN_APP_VERSION')
    };
  }

  static getDetails(): AppDetails {
    return this.APP_DETAILS;
  }
}
