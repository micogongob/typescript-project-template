import { expect } from 'chai';
import { AppDetails } from '../../src/models';
import { AppDetailsHelper } from '../../src/utils';

describe('app details helper', () => {
  describe('getDetails', () => {
    it('should return unknown as default', () => {
      // when
      const details: AppDetails = AppDetailsHelper.getDetails();

      // then
      expect(details.name).to.be.eq('typescript-project-template');
      expect(details.version).to.be.eq('1.0.0');
    });
  });
});