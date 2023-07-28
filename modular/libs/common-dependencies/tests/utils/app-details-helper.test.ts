import { AppDetailsHelper } from '../../src/utils';

describe('AppDetailsHelper', () => {
  describe('getDetails', () => {
    it('should return unknown as default', () => {
      // when
      const details = AppDetailsHelper.getDetails();

      // then
      expect(details.name).toBe('UNKNOWN_APP_NAME');
      expect(details.version).toBe('UNKNOWN_APP_VERSION');
    });
  });
});