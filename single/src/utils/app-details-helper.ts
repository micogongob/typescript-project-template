import { AppDetails } from '../models';

export class AppDetailsHelper {
  private static APP_DETAILS = {
    name: process.env.APP_NAME || 'UNKNOWN_APP_NAME',
    version: process.env.APP_VERSION || 'UNKNOWN_APP_VERSION'
  };

  static getDetails(): AppDetails {
    return AppDetailsHelper.APP_DETAILS;
  }
}
