# iScribe

Component library and Storybook for iScribe, built with React 19, TypeScript, Vite and Storybook 10.

## Getting started

```bash
npm install
npm run storybook
```

Storybook opens at http://localhost:6006.

## Scripts

| Command                   | What it does                                  |
| ------------------------- | --------------------------------------------- |
| `npm run storybook`       | Start Storybook in development mode           |
| `npm run build-storybook` | Build a static Storybook into `storybook-static/` |
| `npm run typecheck`       | Type-check the project                        |

## Structure

```
.storybook/          Storybook configuration
src/
  components/        One folder per component: .tsx, .css, .stories.tsx
  styles/tokens.css  Design tokens (colors, spacing, type)
  Introduction.mdx   Storybook landing page
  index.ts           Library exports
```

## Components

- **Button** — primary, secondary, outline, ghost, destructive and destructive-outline variants; six sizes (Mini–XXL); square or rounded; optional left/right icons; light and dark tokens (from the SuperConscious Figma design system)
- **TextField** — labelled input with hint, error and disabled states
- **NoteCard** — note preview with title, date, excerpt, tags and selected state
