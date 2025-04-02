import { relative } from 'path';
import { FileReference } from './referenceAnalyzer';

/**
 * Format reference analysis results
 * @param references Array of file references
 * @param baseDir Base directory for relative path calculation
 * @returns JSON results
 */
export function formatResults(references: FileReference[], baseDir: string): string {
  const res = references
    .map(ref => ({
      ...ref,
      filePath: relative(baseDir, ref.filePath),
      referencedBy: ref.referencedBy.map(path => relative(baseDir, path)),
    }))
    .sort((a, b) => b.referenceCount - a.referenceCount);
  return JSON.stringify(res, null, 2);
}
