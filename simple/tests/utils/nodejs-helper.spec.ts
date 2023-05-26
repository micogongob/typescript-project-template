import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const { expect } = chai;

import path from 'path';
import { promises as fsPromises } from 'fs';

import { nodeJsHelper } from '../../src/utils';

describe('nodeJsHelper', () => {
  context('resolvePath', () => {
    it('should be equal to path.resolve()', () => {
      expect(
        nodeJsHelper.resolvePath(__dirname, '../../src')
      ).to.eq(
        path.resolve(__dirname, '../../src')
      );
    });
  });

  context('fileBasename', () => {
    it('should be equal to path.basename()', () => {
      expect(
        nodeJsHelper.fileBasename(path.resolve(__dirname, '../../src/index.ts'))
      ).to.eq(
        path.basename(path.resolve(__dirname, '../../src/index.ts'))
      );
    });
  });

  context('findDirectoryContents', async () => {
    it('should be equal to fs.promises.readdir()', async () => {
      const actual: string[] = await nodeJsHelper.findDirectoryContents(__dirname);
      const expected: string[] = await fsPromises.readdir(__dirname);

      expect(actual).to.eql(expected);
    });
  });
});