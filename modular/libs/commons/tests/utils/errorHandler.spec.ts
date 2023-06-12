import { expect } from 'chai';
import { errorHandler } from '../../src/utils';

describe('error handler', () => {
  describe('extractMessageFromErr', () => {
    it('should return from string', () => {
      // when
      const errMsg = errorHandler.parseExceptionMessage('something went wrong');

      // then
      expect(errMsg).to.be.eq('something went wrong');
    });

    it('should return from string', () => {
      // when
      const errMsg = errorHandler.parseExceptionMessage(new Error('I am the senate!'));

      // then
      expect(errMsg).to.be.contain('I am the senate!');
    });

    it('should return default', () => {
      // when
      const errMsg = errorHandler.parseExceptionMessage({ foo: 'bar' });

      // then
      expect(errMsg).to.be.contain('Unparseable exception message');
    });
  });
});