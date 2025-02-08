import { promises as fs } from 'fs';
import path from 'path';

export class JsonService {
  private static readonly dataDirectory = path.join(process.cwd(), 'lib', 'data');

  static async readJson<T>(fileName: string): Promise<T> {
    const filePath = path.join(this.dataDirectory, fileName);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as T;
  }

  static async writeJson<T>(fileName: string, data: T): Promise<void> {
    const filePath = path.join(this.dataDirectory, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
}