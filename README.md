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
  foundations/       Storybook pages for design foundations (Colors, Variables, Icons)
  icons/             Icon component and icon data from the Figma icon page
  styles/colors.css  Color palette from the SuperConscious Figma design system (--is-color-*)
  styles/colors.ts   The same palette as data, used by the Colors page
  styles/variables.css  Every Figma variable: semantic colors (light/dark), roundness, text, button and label sizes
  styles/variables.ts   The same variables as data, used by the Variables page
  styles/tokens.css  Base fonts, spacing and page colors
  Introduction.mdx   Storybook landing page
  index.ts           Library exports
```

## Components

Storybook groups them in two sections:

- **Simple Components** — basic building blocks with a single structure, using only the foundations (colors, variables, icons): Button, IconButton
- **Complex Components** — built by combining simple components and foundations: BottomTab (with its parts SendSlider and BottomTabAlert)

### Simple

- **Button** — primary, secondary, outline, ghost, destructive and destructive-outline variants; six sizes (Mini–XXL); square or rounded; optional left/right icons; every size and color comes from the Figma variables, with light and dark mode
- **IconButton** — icon-only, square (or circle) version of the Button with the same variants, states, sizes and hover behaviour; requires a `label` for screen readers and the tooltip

### Complex

- **BottomTab** — iOS bottom bar for iPhone and iPad (Figma "Bottom Tab"): `content="slide" | "alert" | "alert-button"`. Reuses Button (Review, Button CTA), IconButton (the slider knob) and Icon (arrow-right, alert-flat); also exports its parts `SendSlider` and `BottomTabAlert`
- **Icon** — 63 icons from the Figma icon page (the ones drawn as a single "Vector" layer); `<Icon name="trash" size={16} />`, colored with `currentColor`
