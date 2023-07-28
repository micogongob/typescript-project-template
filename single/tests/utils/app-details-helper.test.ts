import { AppDetailsHelper } from '../../src/utils';

describe('App Details Helper', () => {
  describe('getDetails', () => {
    test('should return unknown as default', () => {
      // when
      const details = AppDetailsHelper.getDetails();

      // then
      expect(details.name).toBe('typescript-project-template');
      expect(details.version).toBe('1.0.0');
    });
  });
});