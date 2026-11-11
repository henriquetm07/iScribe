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
  `  Text        Figtree Medium ${item[d].text}px, var(--is-foreground-high-contrast-primary-foreground)`,
  '  Default     no background',
  '  Selected    var(--is-color-tperiwinkle-20) + 1px var(--is-surface-soft-contrast-background)',
  '              + Figma Glass (frost 4, refraction 0.8, depth 20, light -45° 0.8): blur(4px),',
  '              bright top-left rim, softer bottom-right rim, faint inner glow',
  '              (web only — on iOS and iPadOS use the native glass effect, see Tabs)',
  '  Badge       16px pill, var(--is-status-foreground-positive-pw), white 9px numbers',
];

export const tabItemSpecLines = (p: Partial<TabItemProps>) => {
  const d = p.device ?? 'iphone';
  return [`Tab item · ${deviceName[d]} · ${p.selected ? 'Selected' : 'Default'}`, '', ...itemLines(d)];
};

export const tabsSpecLines = (p: Partial<TabsProps>) => {
  const d = p.device ?? 'iphone';
  return [
    `Tabs · ${deviceName[d]}`,
    '',
    'BAR',
    `  Padding     ${barPadding[d]}px, 5px between tabs; the tabs share the width equally`,
    '  Corners     var(--is-full-round)',
    '  Background  var(--is-surface-super-soft-contrast-background)',
    '',
    'TABS → <TabItem /> (see Components / Tabs / Tab Item)',
    ...itemLines(d),
    '',
    'BEHAVIOUR',
    '  Click a tab → it becomes selected and onChange(value) is called',
    '  The glass indicator slides to the selected tab (420ms, ease-out; instant with reduced motion)',
    '  Keyboard: ← → move and select, Home / End jump',
    '',
    'iOS and iPadOS (iPhone and iPad apps)',
    '  Use the native iOS glass effect (Liquid Glass, iOS 26+) for the selection, not this web version:',
    '  SwiftUI  GlassEffectContainer { … indicator',
    '             .glassEffect(.regular.tint(T Periwinkle 20).interactive(), in: .capsule)',
    '             .glassEffectID("selection", in: namespace) }  — the system morphs it between tabs',
    '  UIKit    UIVisualEffectView(effect: UIGlassEffect) — tintColor T Periwinkle 20, isInteractive = true',
    '  Keep the Figma sizes, colors and Soft Contrast border; the system draws the glass',
  ];
};

export const tabItemSpecComment = (p: Partial<TabItemProps>) => asComment(tabItemSpecLines(p));
export const tabsSpecComment = (p: Partial<TabsProps>) => asComment(tabsSpecLines(p));
