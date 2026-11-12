/**
 * Human-readable reference for the Tabs, shown in the Storybook "Show code" panel. Mirrors Tabs.css.
 */
import { asComment } from '../Button/Button.docs';
import type { TabItemProps, TabsDevice, TabsProps } from './Tabs';

const deviceName: Record<TabsDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };
const item: Record<TabsDevice, { height: number; text: number }> = {
  iphone: { height: 40, text: 13 },
  ipad: { height: 50, text: 15 },
  web: { height: 30, text: 12 },
};
const barPadding: Record<TabsDevice, number> = { iphone: 5, ipad: 10, web: 4 };

const itemLines = (d: TabsDevice) => [
  `  Height      ${item[d].height}px, var(--is-full-round) corners, 8px between label and badge`,
  `  Text        Figtree Medium ${item[d].text}px (SemiBold when selected), var(--is-foreground-high-contrast-primary-foreground)`,
  '  Default     no background',
  '  Selected    glass, tint="periwinkle" (default): var(--is-color-tperiwinkle-20)',
  '              + 1px var(--is-surface-soft-contrast-background) edge',
  '              tint="white": white 88% → 66% gradient, 0.5px edge (dark: white 20% → 9%)',
  '              both: shadow 0 2 4 + 0 10 24 -6, backdrop blur(12px) saturate(170%),',
  '              bright top-left / softer bottom-right inner rims',
  '              (web only — on iOS and iPadOS use the native glass effect, see Tabs)',
  '  Badge       16px pill, var(--is-status-foreground-positive-pw), white 9px numbers',
];

export const tabItemSpecLines = (p: Partial<TabItemProps>) => {
  const d = p.device ?? 'iphone';
  return [`Tab item · ${deviceName[d]} · ${p.selected ? 'Selected' : 'Default'} · ${p.tint ?? 'periwinkle'}`, '', ...itemLines(d)];
};

export const tabsSpecLines = (p: Partial<TabsProps>) => {
  const d = p.device ?? 'iphone';
  return [
    `Tabs · ${deviceName[d]} · ${p.tint ?? 'periwinkle'} glass`,
    '',
    'BAR',
    `  Padding     ${barPadding[d]}px, 5px between tabs; the tabs share the width equally`,
    '  Corners     var(--is-full-round)',
    '  Background  var(--is-surface-super-soft-contrast-background)',
    '',
    'TABS → <TabItem /> (see Components / Tabs / Tab Item)',
    ...itemLines(d),
    '',
    'LIQUID GLASS INDICATOR',
    `  Refraction  ${p.refraction ?? 22}  — edges bend what is under them (SVG displacement map of the pill);`,
    '              labels inside get 20% of it so they stay readable; doubles while held',
    `  Lens        ${p.lens ?? 1.05}  — the selected label inside the glass is enlarged by this factor`,
    `  Elasticity  ${p.elasticity ?? 0.6}  — spring motion: stretches up to 45% wide / 16% short while moving,`,
    '              wobbles as it lands (0 = rigid, 1 = very elastic)',
    '  Highlight   a soft sheen that follows the pointer',
    '',
    'BEHAVIOUR',
    '  Click a tab → it becomes selected and onChange(value) is called; the glass springs there',
    '  Drag the glass → it swells slightly, follows the pointer and drops on the nearest tab',
    '  Keyboard: ← → move and select, Home / End jump',
    '  Reduced motion: the glass jumps, no stretch or wobble',
    '',
    'iOS and iPadOS (iPhone and iPad apps)',
    '  Use the native iOS glass effect (Liquid Glass, iOS 26+) for the selection, not this web version:',
    '  SwiftUI  GlassEffectContainer { … indicator',
    '             .glassEffect(.regular.interactive(), in: .capsule)',
    '             .glassEffectID("selection", in: namespace) }  — the system morphs it between tabs',
    '  UIKit    UIVisualEffectView(effect: UIGlassEffect) — isInteractive = true',
    '  Keep the Figma sizes and colors; the system draws the glass',
  ];
};

export const tabItemSpecComment = (p: Partial<TabItemProps>) => asComment(tabItemSpecLines(p));
export const tabsSpecComment = (p: Partial<TabsProps>) => asComment(tabsSpecLines(p));
