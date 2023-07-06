import { expect } from 'chai';
import { ErrorHandler } from '../../src/utils';

describe('ErrorHandler', () => {
  context('extractMessageFromErr', () => {
    it('should return from string', () => {
      // when
      const errMsg = ErrorHandler.parseExceptionMessage('something went wrong');

      // then
      expect(errMsg).to.be.eq('something went wrong');
    });

    it('should return from string', () => {
      // when
      const errMsg = ErrorHandler.parseExceptionMessage(new Error('I am the senate!'));

      // then
      expect(errMsg).to.be.contain('I am the senate!');
    });

    it('should return default', () => {
      // when
      const errMsg = ErrorHandler.parseExceptionMessage({ foo: 'bar' });

      // then
      expect(errMsg).to.be.contain('Unparseable exception message');
    });
  });
});
