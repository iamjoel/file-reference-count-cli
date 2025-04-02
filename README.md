# File Reference Count CLI

A command-line tool for counting file references in code. It analyzes file dependencies in your project, helping you detect the high frequently referenced files.

## Features

- Supports multiple file types: `.ts`, `.tsx`, `.js`, `.jsx`
- Automatically detects import and require statements
- Supports relative path imports
- Supports path aliases (via tsconfig.json paths)
- Supports index files (e.g., index.ts, index.js)
- Provides file reference count statistics


## Local Development

1. Clone the repository

```bash
git clone https://github.com/yourusername/file-reference-count-cli.git
cd file-reference-count-cli
```

2. Install dependencies

```bash
npm install
```

3. Compile TypeScript

```bash
npm run build
```

4. Create local link

```bash
npm link
```

Now you can use the `file-ref-count` command in any project. To remove the local link, use:

```bash
npm unlink file-ref-count-cli
```

## Usage

```bash
file-ref-count <directory> > output.csv
```

This command analyzes all supported file types in the specified directory and outputs the number of references for each file.

### Examples

#### Default Output Format

```bash
$ file-ref-count ./src > output.csv
```

By default, the tool outputs a simple format with file paths and their reference counts:

```plain
filePath,referenceCount
app/components/base/icons/IconBase.tsx,698
utils/classnames.ts,569
app/components/workflow/types.ts,494
app/components/base/button/index.tsx,263
app/components/base/toast/index.tsx,172
```

#### Detailed Output Format (-d option)

```bash
$ file-ref-count ./src -d > output.json
```

With the -d option, the tool provides detailed information including the files that reference each file:

```json
[
  {
    "filePath": "src/components/Button.tsx",
    "referenceCount": 3,
    "referencedBy": [
      "src/pages/Home.tsx",
      "src/components/Form.tsx",
    ]
  },
  {
    "filePath": "src/utils/helpers.ts",
    "referenceCount": 2,
    "referencedBy": [
      "src/services/api.ts",
      "src/hooks/useData.ts"
    ]
  }
]
```

### Path Aliases Support

The tool supports resolving path aliases defined in your `tsconfig.json` file. Here's how it works:

1. **Configuration Example**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

2. **Import Resolution**

When analyzing files, the tool will:
- Match import paths against your tsconfig.json paths configuration
- Resolve aliased imports to their actual file paths
- Count references correctly for aliased imports

For example, an import like `import { Button } from '@components/Button'` will be resolved to `src/components/Button.ts` (or other supported extensions).

### Use Cases

1. **Finding High-Impact Files**
   - Identify frequently referenced files that might need extra attention during code reviews
   - Locate core utility files that multiple components depend on
   - Understand which components are most reused across your project

2. **Refactoring Planning**
   - Assess the impact of planned changes by understanding file dependencies
   - Identify potential bottlenecks in your codebase
   - Make informed decisions about code splitting and modularization

## Tech Stack

- TypeScript
- Node.js
- Jest (for testing)

## License

[MIT](./LICENSE)