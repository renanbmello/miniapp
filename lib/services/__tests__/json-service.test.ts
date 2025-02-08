import { Block } from 'ethers';
import { JsonService } from '../json-service';
import { promises as fs } from 'fs';
import path from 'path';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('JsonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read JSON file successfully', async () => {
    const mockBlock = {
      number: 1000,
      transactions: ['0x123']
    };

    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockBlock));

    const result = await JsonService.readJson('proposals.json');

    expect(result).toEqual(mockBlock);
    expect(fs.readFile).toHaveBeenCalledWith(
      expect.stringContaining('proposals.json'),
      'utf8'
    );
  });

  it('should handle read errors', async () => {
    const mockError = new Error('File not found');
    (fs.readFile as jest.Mock).mockRejectedValue(mockError);

    await expect(JsonService.readJson('proposals.json')).rejects.toThrow('File not found');
  });
});