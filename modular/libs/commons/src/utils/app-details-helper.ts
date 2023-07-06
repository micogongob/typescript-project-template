import { AppDetails } from '../models';

export class AppDetailsHelper {
  private static APP_DETAILS: AppDetails = {
    name: process.env.APP_NAME || 'UNKNOWN_APP_NAME',
    version: process.env.APP_VERSION || 'UNKNOWN_APP_VERSION'
  };

  static getDetails(): AppDetails {
    return this.APP_DETAILS;
  }
}
