import { AppDetails } from '../models';

const appDetails: AppDetails = {
  name: process.env.APP_NAME || 'UNKNOWN_APP_NAME',
  version: process.env.APP_VERSION || 'UNKNOWN_APP_VERSION'
};

export function getDetails(): AppDetails {
  return appDetails;
}
