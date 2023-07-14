import path from 'path';
import { promises as fsPromises } from 'fs';

export class NodeJsHelper {
  static resolvePath(...strings: string[]): string {
    return path.resolve(...strings);
  }

  static fileBasename(filePath: string): string {
    return path.basename(filePath);
  }

  static findDirectoryContents(directory: string): Promise<string[]> {
    return fsPromises.readdir(directory);
  }
}
