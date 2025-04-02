# File Reference Count CLI

A command-line tool for counting file references in code. It analyzes file dependencies in your project, helping you understand the relationships between code files.

## Features

- Supports multiple file types: `.ts`, `.tsx`, `.js`, `.jsx`
- Automatically detects import and require statements
- Supports relative path imports
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
file-ref-count <directory> > output.json
```

This command analyzes all supported file types in the specified directory and outputs the number of references for each file.

### Example

```bash
$ file-reference-count ./src
```

Output:
```json
{
  "files": [
    {
      "path": "src/components/Button.tsx",
      "referenceCount": 15,
      "referencedBy": [
        "src/pages/Home.tsx",
        "src/components/Form.tsx",
        "src/components/Header.tsx"
      ]
    },
    {
      "path": "src/utils/helpers.ts",
      "referenceCount": 8,
      "referencedBy": [
        "src/services/api.ts",
        "src/hooks/useData.ts"
      ]
    }
  ]
}
```

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