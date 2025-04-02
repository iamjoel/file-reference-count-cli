#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { findSourceFiles } from './fileSearch';
import { analyzeReferences } from './referenceAnalyzer';
import { formatResults } from './resultFormatter';

const program = new Command();

program
  .name('file-ref-count')
  .description('Count references of TypeScript/JavaScript files in a directory')
  .argument('<directory>', 'Directory to analyze')
  .action(async (directory: string) => {
    try {
      const targetDir = resolve(directory);

      // Get all target files
      const files = await findSourceFiles(targetDir);

      // Analyze file references
      const referenceMap = analyzeReferences(files);

      // Format results
      const results = formatResults(referenceMap, targetDir);

      // Generate and print table
      console.log(results);

    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse();