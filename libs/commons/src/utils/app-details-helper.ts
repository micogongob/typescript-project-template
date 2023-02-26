import { AppDetails } from '@local/commons';

const appDetails: AppDetails = {
  name: process.env.APP_NAME || 'UNKNOWN',
  version: process.env.APP_VERSION || 'UNKNOWN'
};

function getDetails(): AppDetails {
  return appDetails;
}

export default {
  getDetails
};
