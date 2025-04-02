import { findSourceFiles } from '../fileSearch';
import { resolve } from 'path';
import { mkdirSync, writeFileSync, rmSync } from 'fs';

describe('findSourceFiles', () => {
  const testDir = resolve(__dirname, 'test-files');

  beforeEach(() => {
    // Create test directories and files
    mkdirSync(testDir, { recursive: true });
    mkdirSync(resolve(testDir, 'node_modules'), { recursive: true });
    mkdirSync(resolve(testDir, 'src'), { recursive: true });

    writeFileSync(resolve(testDir, 'src/index.ts'), '');
    writeFileSync(resolve(testDir, 'src/test.tsx'), '');
    writeFileSync(resolve(testDir, 'src/util.js'), '');
    writeFileSync(resolve(testDir, 'node_modules/test.ts'), '');
  });

  afterEach(() => {
    // Clean up test directory
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should find all TypeScript and JavaScript files', async () => {
    const files = await findSourceFiles(testDir);
    expect(files).toHaveLength(3);
    expect(files.map(f => f.replace(testDir, ''))).toEqual(
      expect.arrayContaining([
        '/src/index.ts',
        '/src/test.tsx',
        '/src/util.js'
      ].map(p => p.replace(/\//g, process.platform === 'win32' ? '\\' : '/')))
    );
  });

  it('should ignore node_modules directory', async () => {
    const files = await findSourceFiles(testDir);
    expect(files.some(f => f.includes('node_modules'))).toBe(false);
  });

  it('should return absolute paths', async () => {
    const files = await findSourceFiles(testDir);
    expect(files.every(f => f.startsWith('/'))).toBe(true);
  });
});