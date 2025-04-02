import { analyzeReferences, findImportStatements, incrementReferenceCount } from '../referenceAnalyzer';
import { resolve } from 'path';

describe('referenceAnalyzer', () => {
  describe('findImportStatements', () => {
    it('should find all import statements', () => {
      const content = `
        import { test } from './test';
        import type { Type } from '../types';
        import default from './default';
      `;
      const imports = findImportStatements(content);
      expect(imports).toEqual(['./test', '../types', './default']);
    });

    it('should find all require statements', () => {
      const content = `
        const test = require('./test');
        const { type } = require('../types');
      `;
      const imports = findImportStatements(content);
      expect(imports).toEqual(['./test', '../types']);
    });

    it('should ignore non-relative path imports', () => {
      const content = `
        import { test } from 'test';
        const lib = require('lib');
      `;
      const imports = findImportStatements(content);
      expect(imports).toEqual(['test', 'lib']);
    });
  });

  describe('incrementReferenceCount', () => {
    it('should increment file reference count', () => {
      const referenceMap = new Map<string, number>();
      const filePath = '/test/file.ts';
      referenceMap.set(filePath, 0);

      incrementReferenceCount(filePath, referenceMap);
      expect(referenceMap.get(filePath)).toBe(1);
    });

    it('should handle different file extensions', () => {
      const referenceMap = new Map<string, number>();
      const tsFile = '/test/file.ts';
      const jsFile = '/test/other.js';
      referenceMap.set(tsFile, 0);
      referenceMap.set(jsFile, 0);

      incrementReferenceCount('/test/file', referenceMap);
      incrementReferenceCount('/test/other', referenceMap);

      expect(referenceMap.get(tsFile)).toBe(1);
      expect(referenceMap.get(jsFile)).toBe(1);
    });
  });

  describe('analyzeReferences', () => {
    it('should analyze file references', () => {
      const files = [
        resolve(__dirname, 'test-files/a.ts'),
        resolve(__dirname, 'test-files/b.ts')
      ];

      // Mock file content
      const mockReadFileSync = jest.spyOn(require('fs'), 'readFileSync') as jest.SpyInstance;
      mockReadFileSync.mockImplementation((path) => {
        const pathStr = path.toString();
        if (pathStr.includes('a.ts')) {
          return 'import { b } from "./b";';
        }
        return '';
      });

      const references = analyzeReferences(files);
      const fileB = references.find(ref => ref.filePath === files[1]);
      const fileA = references.find(ref => ref.filePath === files[0]);

      expect(fileB?.referenceCount).toBe(1); // b.ts is referenced once
      expect(fileB?.referencedBy).toContain(files[0]); // b.ts is referenced by a.ts
      expect(fileA?.referenceCount).toBe(0); // a.ts is not referenced
      expect(fileA?.referencedBy).toHaveLength(0); // a.ts is not referenced by any file
    });
  });
});