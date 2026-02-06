# CV Builder CLI

A React Ink CLI for managing CV templates and running the CV builder app.

## Structure

```
cli/
├── package.json      # Ink + React dependencies
├── tsconfig.json     # TypeScript config
└── src/
    ├── index.tsx     # Entry point
    └── App.tsx       # Main CLI component
```

## Features

1. Lists all JSON files from `src/data/` (excluding `cv.json` and `example.json`)
2. Marks empty files with "(empty)" label
3. On selection, copies chosen file to `cv.json`
4. Main menu with options:
   - Run Dev Server (`npm run dev`)
   - Build for Production (`npm run build`)
   - Preview Production Build (`npm run preview`)
   - Change CV Template
   - Exit
5. Shows command output with URLs highlighted
6. For servers: waits 3 seconds, displays output (including URL), then lets you return to menu
7. For build: waits for completion, shows output, then returns to menu

## Usage

```bash
npm run cli    # Run from project root
```

When you select a CV template, it will copy it to `src/data/cv.json`, then you can run the dev server or build the React app directly from the CLI.

## Creating a New CV Template

See `src/data/example.json` for the required JSON structure. Copy this file, rename it, and fill in your details.

The CLI ignores `cv.json` and `example.json` - only your custom CV files will appear in the selection menu.
