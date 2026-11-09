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
  foundations/       Storybook pages for design foundations (Colors)
  styles/colors.css  Color palette from the SuperConscious Figma design system (--is-color-*)
  styles/colors.ts   The same palette as data, used by the Colors page
  styles/tokens.css  Semantic design tokens (button colors, spacing, type, light/dark)
  Introduction.mdx   Storybook landing page
  index.ts           Library exports
```

## Components

- **Button** — primary, secondary, outline, ghost, destructive and destructive-outline variants; six sizes (Mini–XXL); square or rounded; optional left/right icons; light and dark tokens (from the SuperConscious Figma design system)
- **TextField** — labelled input with hint, error and disabled states
- **NoteCard** — note preview with title, date, excerpt, tags and selected state
