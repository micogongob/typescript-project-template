import { expect } from 'chai';
import { AppDetailsHelper } from '../../src/utils';

describe('App Details Helper', () => {
  context('getDetails', () => {
    it('should return unknown as default', () => {
      // when
      const details = AppDetailsHelper.getDetails();

      // then
      expect(details).to.haveOwnProperty('name', 'typescript-project-template');
      expect(details).to.haveOwnProperty('version', '1.0.0');
    });
  });
});