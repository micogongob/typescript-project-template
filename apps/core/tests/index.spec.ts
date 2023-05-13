import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import R from 'ramda';

chai.use(sinonChai);

const { expect } = chai;

import { testHelper } from '@local/test-dependencies';

describe('Server', () => {
  let listenStub: sinon.SinonStub;

  beforeEach(() => {
    listenStub = sinon.stub().returns({
      type: 'SERVER'
    });
  });

  afterEach(() => {

  });

  const createProxy = testHelper.createProxyFunc([__dirname, '../src/index'], () => {
    return {
      './app': {
        app: {
          listen: listenStub
        }
      }
    };
  });

  it('should listen to port 3000', () => {
    const { server } = createProxy();

    expect(R.pathOr(undefined, ['firstCall', 'args', 0], listenStub)).to.eq(3000);
    expect(server).to.eql({ type: 'SERVER' });
  });
});