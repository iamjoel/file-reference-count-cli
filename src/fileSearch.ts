import { glob } from 'glob';

/**
 * Find all source files in the directory
 * @param directory Directory to search
 * @returns Array of source file paths
 */
export async function findSourceFiles(directory: string): Promise<string[]> {
  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: directory,
    ignore: ['node_modules/**', 'dist/**', '**/*.d.ts'],
    absolute: true
  });
  return files;
}