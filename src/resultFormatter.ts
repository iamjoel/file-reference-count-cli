import { relative } from 'path';
import { FileReference } from './referenceAnalyzer';

/**
 * Format reference analysis results
 * @param references Array of file references
 * @param baseDir Base directory for relative path calculation
 * @returns JSON results
 */
export function formatResults(references: FileReference[], baseDir: string, detailed: boolean = false): string {
  const res = references
    .map(ref => {
      const filePath = relative(baseDir, ref.filePath);
      if (detailed) {
        return {
          filePath,
          referenceCount: ref.referenceCount,
          referencedBy: ref.referencedBy.map(path => relative(baseDir, path))
        };
      }
      return { [filePath]: ref.referenceCount };
    })
    .sort((a, b) => {
      const countA = detailed ? a.referenceCount : Object.values(a)[0];
      const countB = detailed ? b.referenceCount : Object.values(b)[0];
      return (countB as number) - (countA as number);
    });
  return JSON.stringify(res, null, 2);
}
