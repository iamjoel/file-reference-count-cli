import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

interface TsConfig {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}

function loadTsConfig(projectRoot: string): TsConfig | null {
  const tsConfigPath = resolve(projectRoot, 'tsconfig.json');
  if (!existsSync(tsConfigPath)) return null;

  try {
    const content = readFileSync(tsConfigPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function resolveAliasPath(importPath: string, projectRoot: string, paths?: Record<string, string[]>): string | null {
  if (!paths) return null;
  for (const [alias, [aliasPath]] of Object.entries(paths)) {
    const aliasPattern = alias.replace(/\*/g, '(.*)');
    const match = importPath.match(new RegExp(`^${aliasPattern}$`));
    if (match) {
      const wildcard = match[1] || '';
      const resolvedPath = aliasPath.replace('*', wildcard);
      return resolve(projectRoot, resolvedPath);
    }
  }
  return null;
}

export interface FileReference {
  filePath: string;
  referenceCount: number;
  referencedBy: string[];
}

/**
 * Analyzes file references in the given files
 * @param files Array of file paths to analyze
 * @returns Map of file references
 */
export function analyzeReferences(files: string[], projectRoot: string): FileReference[] {
  const tsConfig = loadTsConfig(projectRoot);
  const paths = tsConfig?.compilerOptions?.paths;

  const referenceMap = new Map<string, { count: number; referencedBy: Set<string> }>();

  // Initialize reference counts and referencedBy sets
  files.forEach(file => {
    referenceMap.set(file, { count: 0, referencedBy: new Set<string>() });
  });

  // Analyze references in each file
  files.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    const importMatches = findImportStatements(content);

    importMatches.forEach(importPath => {
      const aliasPath = resolveAliasPath(importPath, projectRoot, paths);
      if (aliasPath || importPath.startsWith('.')) {
        const baseAbsolutePath = aliasPath || resolve(file, '..', importPath);
        const extensions = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js", "/index.jsx"];

        for (const ext of extensions) {
          const absolutePath = baseAbsolutePath + ext;
          const reference = referenceMap.get(absolutePath);
          if (reference) {
            reference.count++;
            reference.referencedBy.add(file);
            break;
          }
        }
      }
    });
  });

  // Convert Map to FileReference array
  return Array.from(referenceMap.entries()).map(([filePath, { count, referencedBy }]) => ({
    filePath,
    referenceCount: count,
    referencedBy: Array.from(referencedBy)
  }));
}

/**
 * Find import statements in file content
 * @param content File content to analyze
 * @returns Array of import paths
 */
export function findImportStatements(content: string): string[] {
  const importMatches = content.match(/(?:from|import)\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g) || [];
  return importMatches
    .map(match => {
      const path = match.match(/['"]([^'"]+)['"]/);
      return path ? path[1] : undefined;
    })
    .filter((path): path is string => path !== undefined);
}

/**
 * Increment the reference count for a file
 * @param absolutePath Absolute path of the file
 * @param referenceMap Reference count mapping
 */
export function incrementReferenceCount(absolutePath: string, referenceMap: Map<string, number>): void {
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];

  for (const ext of extensions) {
    const fullPath = absolutePath + (absolutePath.endsWith(ext) ? '' : ext);
    if (referenceMap.has(fullPath)) {
      referenceMap.set(fullPath, (referenceMap.get(fullPath) || 0) + 1);
      break;
    }
  }
}