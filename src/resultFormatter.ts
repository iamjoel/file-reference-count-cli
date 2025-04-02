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
  const sortedList = [...res].sort((a, b) => {
    const countA = detailed ? a.referenceCount : Object.values(a)[0];
    const countB = detailed ? b.referenceCount : Object.values(b)[0];
    return (countB as number) - (countA as number);
  });
  if (detailed) {
    return JSON.stringify(sortedList, null, 2);
  }
  // CSV header
  let csvOutput = 'filePath,referenceCount\n';
  // Add each file's data
  sortedList.forEach((item: any) => {
    const filePath = Object.keys(item)[0];
    const count = item[filePath] || 0;
    csvOutput += `${filePath},${count}\n`;
  });
  return csvOutput;
}
