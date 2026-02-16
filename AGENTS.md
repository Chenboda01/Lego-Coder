# AGENTS.md - Lego Coder Project

This document provides essential information for AI agents working on the Lego Coder project—a static website for LEGO Mindstorms EV3 built with HTML, CSS, and JavaScript, hosted on GitHub Pages.

## Project Overview

- **Type**: Static website (HTML, CSS, JavaScript)
- **Hosting**: GitHub Pages
- **Live URL**: https://chenboda01.github.io/Lego-Coder/
- **Repository**: Currently a fresh directory with only a README.md

## Build, Lint, and Test Commands

*No build system or package manager is currently configured.*  
If you need to run a local development server, use one of the following commands:

```bash
# Python 3 simple HTTP server (port 8000)
python3 -m http.server 8000

# Node.js `serve` (install globally with `npm install -g serve`)
serve .

# PHP built‑in server (port 8080)
php -S localhost:8080
```

**Recommended future tooling** (not yet set up):

| Tool | Purpose | Suggested Command |
|------|---------|-------------------|
| **Vite** | Fast dev server & build | `npm run dev` / `npm run build` |
| **ESLint** | JavaScript linting | `npm run lint` |
| **Prettier** | Code formatting | `npm run format` / `npm run format:check` |
| **Stylelint** | CSS linting | `npm run stylelint` |
| **Jest** | Unit testing | `npm test` |
| **Playwright** | End‑to‑end testing | `npm run test:e2e` |

**Running a single test** (if Jest is configured):
```bash
npm test -- --testPathPattern=filename
```
**Running a single Playwright test** (if Playwright is configured):
```bash
npx playwright test filename.spec.js
```

Before adding any tooling, verify that a `package.json` exists. If not, ask the user whether they want to initialize a Node.js project.

## Code Style Guidelines

Because no existing style configuration is present, follow these general web‑development conventions until the project adopts specific rules.

### File Organization

- Place HTML files in the project root or in `src/` if a build step is added.
- CSS files can be in a `css/` or `styles/` directory.
- JavaScript files can be in a `js/` or `src/` directory.
- Use lowercase, hyphen‑separated names for files (e.g., `main‑page.html`, `theme‑dark.css`).

### HTML

- Use HTML5 doctype: `<!DOCTYPE html>`
- Indent with 2 spaces (no tabs).
- Always include `lang` attribute on `<html>` (e.g., `<html lang="en">`).
- Use semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Close all tags (self‑closing tags like `<img>` do not need a trailing slash).
- Quote all attribute values (`<div class="container">`).
- Keep inline scripts and styles to a minimum; prefer external files.

### CSS

- Use lowercase for selectors, properties, and values.
- Indent with 2 spaces.
- Use kebab‑case for class names (`.main‑container`, `.button‑primary`).
- Group related rules with a blank line between groups.
- Avoid IDs for styling; prefer classes.
- Consider using CSS custom properties (variables) for theming.

### JavaScript

- Use `'use strict';` at the top of each JS file.
- Prefer `const` for values that don’t change, `let` for variables that do, avoid `var`.
- Use arrow functions for callbacks, regular `function` declarations for named functions.
- Use template literals for string interpolation.
- Use `===` and `!==` over `==` and `!=`.
- Indent with 2 spaces.
- End statements with semicolons.
- Use camelCase for variables and functions, PascalCase for constructors/classes.
- Prefer async/await over raw promises where possible.

### Imports

- For ES modules (if supported), use:
  ```js
  import { something } from './module.js';
  ```
- For classic scripts, use `<script src="...">` in HTML.
- If a bundler is added, follow its import conventions.

### Error Handling

- Wrap risky operations in `try`/`catch` blocks.
- Provide user‑friendly error messages in the UI, not just console logs.
- Validate user inputs before processing.

### Naming Conventions

- **Files**: lowercase, hyphen‑separated (`home‑page.html`)
- **HTML IDs/classes**: kebab‑case (`main‑content`, `submit‑button`)
- **JavaScript**: camelCase (`getUserInput`, `currentPage`)
- **CSS custom properties**: kebab‑case (`--primary‑color`)

## Agent‑Specific Instructions

### Before Making Changes

1. **Check for existing configuration**: Look for `.cursorrules`, `.cursor/rules/`, `.github/copilot‑instructions.md`, `.eslintrc`, `.prettierrc`, `package.json`, etc. If any of these files exist, incorporate their instructions into your work.
2. **Verify the project state**: Run `ls -la` and `find . -type f -name '*.html' -o -name '*.css' -o -name '*.js'` to see what files already exist.
3. **Ask before adding tooling**: If the project lacks a build system or linter, propose a simple setup (e.g., `npm init`, `eslint --init`) and get user approval.

### When Writing Code

- Match the existing style if any files are present.
- If the directory is empty, adopt the conventions above.
- Never suppress type errors with `as any`, `@ts‑ignore`, or `@ts‑expect‑error` (if TypeScript is introduced later).
- Never commit secrets (`.env`, API keys, credentials).
- Ensure HTML is valid (run through a validator if possible).
- Test JavaScript in a browser console or with a headless browser (Playwright) if tests are configured.

### Testing and Verification

- If a test suite exists, run it before marking a task complete.
- If no tests exist, manually verify the UI works as expected (open the HTML file in a browser or use a headless browser).
- After editing files, run `lsp_diagnostics` on changed files (if the language server supports HTML/CSS/JS) to catch obvious errors.

### Git & Version Control

- The directory is not currently a git repository. If the user asks to commit changes, first check if `.git` exists; if not, ask whether to initialize a repo.
- Follow the user’s commit‑message style (none yet). Use concise, imperative messages (e.g., “Add landing page”, “Fix button click handler”).

## Quick Reference

| Task | Command / Action |
|------|------------------|
| Start a local server | `python3 -m http.server 8000` |
| Check for HTML files | `find . -name '*.html'` |
| Check for CSS files | `find . -name '*.css'` |
| Check for JS files | `find . -name '*.js'` |
| Lint JavaScript (if ESLint installed) | `npx eslint .` |
| Format code (if Prettier installed) | `npx prettier --write .` |
| Validate HTML (with `tidy`) | `tidy -q -errors *.html` (if installed) |
| Run Jest test (single file) | `npm test -- --testPathPattern=filename` |
| Run Playwright test (single file) | `npx playwright test filename.spec.js` |

## Notes

- This project is described as a “virtual website for a new style for LEGO Mindstorms EV3.” The intended workflow involves a high‑tech blue screen for software selection, a coding interface, and USB upload to an EV3 brick.
- The current directory contains only `README.md`. Future work will likely involve creating HTML, CSS, and JavaScript files to implement the described features.
- Because there are no existing conventions, agents should propose consistent patterns and get user approval before establishing tooling or style rules.

---

*This AGENTS.md file was generated on 2026‑02‑16. Update it as the project evolves.*