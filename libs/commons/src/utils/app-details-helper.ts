import { AppDetails } from '../models';

const appDetails: AppDetails = {
  name: process.env.APP_NAME || 'UNKNOWN',
  version: process.env.APP_VERSION || 'UNKNOWN'
};

export function getDetails(): AppDetails {
  return appDetails;
}
