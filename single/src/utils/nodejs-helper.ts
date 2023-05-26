import path from 'path';
import { promises as fsPromises } from 'fs';

export function resolvePath(...strings: string[]): string {
  return path.resolve(...strings);
};

export function fileBasename(filePath: string): string {
  return path.basename(filePath);
};

export function findDirectoryContents(directory: string): Promise<string[]> {
  return fsPromises.readdir(directory);
}
