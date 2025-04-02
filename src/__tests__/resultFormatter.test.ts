import { formatResults } from '../resultFormatter';

describe('resultFormatter', () => {
  const baseDir = '/test/base/dir';
  const mockReferences = [
    {
      filePath: '/test/base/dir/file1.ts',
      referenceCount: 3,
      referencedBy: [
        '/test/base/dir/file2.ts',
        '/test/base/dir/file3.ts',
        '/test/base/dir/file4.ts'
      ]
    },
    {
      filePath: '/test/base/dir/file2.ts',
      referenceCount: 2,
      referencedBy: [
        '/test/base/dir/file3.ts',
        '/test/base/dir/file4.ts'
      ]
    },
    {
      filePath: '/test/base/dir/file3.ts',
      referenceCount: 1,
      referencedBy: [
        '/test/base/dir/file4.ts'
      ]
    }
  ];

  it('should format results correctly', () => {
    const result = formatResults(mockReferences, baseDir, true);
    const parsedResult = JSON.parse(result);

    expect(Array.isArray(parsedResult)).toBe(true);

    expect(parsedResult.length).toBe(mockReferences.length);

    expect(parsedResult[0].referenceCount).toBe(3);
    expect(parsedResult[1].referenceCount).toBe(2);
    expect(parsedResult[2].referenceCount).toBe(1);

    // 验证文件路径是相对路径
    expect(parsedResult[0].filePath).toBe('file1.ts');
    expect(parsedResult[1].filePath).toBe('file2.ts');
    expect(parsedResult[2].filePath).toBe('file3.ts');

    // 验证引用文件列表
    expect(parsedResult[0].referencedBy).toEqual([
      'file2.ts',
      'file3.ts',
      'file4.ts'
    ]);
  });
});