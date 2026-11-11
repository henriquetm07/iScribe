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
  foundations/       Storybook pages for design foundations (Colors, Variables, Icons, Animated Icons)
  icons/             Icon and AnimatedIcon components, icon data, and animated/ (Lottie JSON files)
  styles/colors.css  Color palette from the SuperConscious Figma design system (--is-color-*)
  styles/colors.ts   The same palette as data, used by the Colors page
  styles/variables.css  Every Figma variable: semantic colors (light/dark), roundness, text, button and label sizes
  styles/variables.ts   The same variables as data, used by the Variables page
  styles/tokens.css  Base fonts, spacing and page colors
  Introduction.mdx   Storybook landing page
  index.ts           Library exports
```

## Components

Storybook lists them all under **Components**.

- **Button** — primary, secondary, outline, ghost, destructive and destructive-outline variants; six sizes (Mini–XXL); square or rounded; optional left/right icons; every size and color comes from the Figma variables, with light and dark mode
- **SelectionList** / **SelectionListItem** — a card of selectable rows for iPhone, iPad and Web (Figma "Selection List"): one selected value with a check mark, hover, destructive rows, optional icons, keyboard navigation and a scroller after `visibleRows`
- **Dropdown** / **DropdownField** — a field for Web, iPhone and iPad (Figma "Dropdown") with Default and Active states; when active it opens a **SelectionList** of the options (same device and width). Keyboard: ↓ / Enter / Space open, Escape closes
- **IconButton** — icon-only, square (or circle) version of the Button with the same variants, states, sizes and hover behaviour; requires a `label` for screen readers and the tooltip
- **Tabs** / **TabItem** — a pill-shaped bar of equal-width tabs for iPhone, iPad and Web (Figma "Tabs"): the selected tab is periwinkle, optional count badges, keyboard ← / → / Home / End
- **WebNavBar** — web top bar (Figma "Web Nav Bar"): logo, menu of ghost Buttons, "Download Chrome Extension", practice Dropdown, avatar with account menu, search and connectivity (with alert badge). `menu="auto"` (default) compacts the menu into a button that opens a SelectionList when the bar is too narrow; `"default"` / `"compressed"` force a layout. Also exports `Logo` (iScribe logo in currentColor) and `ChromeIcon`
- **BottomTab** — iOS bottom bar for iPhone and iPad (Figma "Bottom Tab"): `content="slide" | "alert" | "alert-button"`. Reuses Button (Review, Button CTA), IconButton (the slider knob) and Icon (arrow-right, alert-flat); also exports its parts `SendSlider` and `BottomTabAlert`
- **Icon** — 63 icons from the Figma icon page (the ones drawn as a single "Vector" layer); `<Icon name="trash" size={16} />`, colored with `currentColor`
- **AnimatedIcon** — Lottie (JSON) icons on the same 12 × 12 grid, colored with `currentColor`: `<AnimatedIcon name="arrow-to-check" />`, with `loop`, `speed`, `onMarker` and `fallback`. The player (`lottie-web`) loads on first use
