import { expect } from 'chai';
import { AppDetailsHelper } from '../../src/utils';

describe('AppDetailsHelper', () => {
  context('getDetails', () => {
    it('should return unknown as default', () => {
      // when
      const details = AppDetailsHelper.getDetails();

      // then
      expect(details).to.haveOwnProperty('name', 'UNKNOWN_APP_NAME');
      expect(details).to.haveOwnProperty('version', 'UNKNOWN_APP_VERSION');
    });
  });
});