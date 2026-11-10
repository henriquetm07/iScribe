/**
 * Human-readable reference for the Dropdown, shown in the Storybook "Show code" panel:
 * sizes, spacing, colors (Figma variables) and behaviour. Mirrors Dropdown.css.
 */
import { asComment } from '../Button/Button.docs';
import type { DropdownDevice, DropdownProps } from './Dropdown';

const deviceName: Record<DropdownDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };
const spec: Record<DropdownDevice, { height: number; padding: string; radius: string; icon: number; text: number }> = {
  web: { height: 28, padding: '5px 12px', radius: 'var(--is-round-m) → 10px', icon: 12, text: 13 },
  iphone: { height: 50, padding: '10px 20px', radius: 'var(--is-round-l) → 12px', icon: 16, text: 13 },
  ipad: { height: 60, padding: '15px 20px', radius: 'var(--is-round-xl) → 16px', icon: 20, text: 14 },
};

export const dropdownSpecLines = (p: Partial<DropdownProps>) => {
  const d = p.device ?? 'iphone';
  const s = spec[d];
  return [
    `Dropdown · ${deviceName[d]}${p.open ? ' · Active' : ''}`,
    '',
    'FIELD',
    `  Size        ${typeof p.width === 'number' ? `${p.width}px` : p.width ?? '305px'} wide, ${s.height}px tall`,
    `  Padding     ${s.padding}`,
    `  Corners     ${s.radius}`,
    '  Border      1px var(--is-surface-soft-contrast-background)',
    '  Background  Default: var(--is-surface-super-soft-contrast-background)',
    '              Hover: var(--is-button-secondary-active-bg), corners + 1/8 of the height (as the secondary Button)',
    '              Active (open): var(--is-surface-medium-contrast-background)',
    `  Text        Figtree Medium ${s.text}px / 18px, var(--is-foreground-high-contrast-primary-foreground)`,
    `  Icon        ${s.icon}px, <Icon name="chevron-down" /> · <Icon name="chevron-up" /> when active`,
    '',
    'MENU (when active) → <SelectionList /> (see Components / Selection List)',
    `  Same device as the field, ${p.menuWidth !== undefined ? `${typeof p.menuWidth === 'number' ? `${p.menuWidth}px` : p.menuWidth} wide` : 'same width'}, 6px below it`,
    `  Shows ${p.visibleRows ?? 5} rows, then scrolls; selected row icon: ${p.selectedIcon ?? 'check'}`,
    '',
    'BEHAVIOUR',
    '  Click, ↓, Enter or Space opens the menu; picking a row selects it and closes',
    '  Escape or a click outside closes; onChange(value) and onOpenChange(open)',
  ];
};

export const dropdownSpecComment = (p: Partial<DropdownProps>) => asComment(dropdownSpecLines(p));
