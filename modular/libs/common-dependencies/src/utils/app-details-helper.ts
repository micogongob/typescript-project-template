import { AppDetails } from '../types';

export class AppDetailsHelper {
  private static APP_DETAILS: AppDetails;

  static {
    this.APP_DETAILS = {
      name:  process.env.APP_NAME ? process.env.APP_NAME : 'UNKNOWN_APP_NAME',
      version:  process.env.APP_VERSION ? process.env.APP_VERSION : 'UNKNOWN_APP_VERSION'
    };
  }

  static getDetails(): AppDetails {
    return this.APP_DETAILS;
  }
}
