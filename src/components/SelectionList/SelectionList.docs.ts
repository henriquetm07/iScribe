/**
 * Human-readable reference for the Selection List, shown in the Storybook "Show code" panel:
 * sizes, spacing, colors (Figma variables) and behaviour.
 */
import { asComment } from '../Button/Button.docs';
import type { SelectionListProps } from './SelectionList';
import type { SelectionListDevice, SelectionListItemProps } from './SelectionListItem';

const deviceName: Record<SelectionListDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };
const rowHeight: Record<SelectionListDevice, number> = { iphone: 40, ipad: 50, web: 36 };
const iconSize: Record<SelectionListDevice, number> = { iphone: 18, ipad: 20, web: 16 };

export const selectionListItemSpecLines = (p: Partial<SelectionListItemProps>) => {
  const d = p.device ?? 'iphone';
  const state = p.selected ? 'Selected' : p.destructive ? 'Destructive' : 'Default';
  return [
    `Selection List Item · ${deviceName[d]} · ${state}`,
    '',
    'SIZE',
    `  Height      ${rowHeight[d]}px, fills the list width`,
    '  Padding     10px top/bottom, 12px left/right; 10px between icon and label',
    `  Icons       ${iconSize[d]}px (Foundations / Icons); left optional, right optional`,
    '  Corners     var(--is-round-l) → 12px',
    '',
    'TEXT',
    `  Figtree SemiBold 13px, ${p.destructive ? 'var(--is-status-foreground-alert) (red)' : 'var(--is-foreground-high-contrast-primary-foreground)'}`,
    '  Long labels end with …',
    '',
    'STATES',
    '  Default     no background',
    '  Hover       var(--is-surface-super-soft-contrast-background)',
    '  Selected    var(--is-surface-soft-selection) + <Icon name="check" /> on the right',
    '  Destructive text in var(--is-status-foreground-alert)',
    '  Focus       2px var(--is-button-accent) outline (keyboard)',
  ];
};

export const selectionListSpecLines = (p: Partial<SelectionListProps>) => {
  const d = p.device ?? 'iphone';
  return [
    `Selection List · ${deviceName[d]}`,
    '',
    'CARD',
    `  Width       ${typeof p.width === 'number' ? `${p.width}px` : p.width ?? '300px'}`,
    '  Padding     4px',
    '  Corners     var(--is-round-xl) → 16px',
    '  Background  var(--is-background-elevated-background)',
    '  Border      1px var(--is-surface-soft-contrast-background)',
    '  Shadow      0 0 20px var(--is-shadow-basic-shadow)',
    '',
    'ROWS → <SelectionListItem /> (see Simple Components / Selection List / Selection List Item)',
    `  ${rowHeight[d]}px each, stacked with no gap`,
    p.visibleRows
      ? `  Shows ${p.visibleRows} rows (${p.visibleRows * rowHeight[d]}px), then scrolls`
      : '  Shows every row (set visibleRows to scroll)',
    '',
    'SCROLLER (only when the rows overflow)',
    '  10px pill, var(--is-surface-soft-contrast-background), 5px from the rows',
    '',
    'BEHAVIOUR',
    '  Click a row → it becomes the selected value and onChange(value) is called',
    '  Keyboard: ↑ ↓ move, Home / End jump, Enter / Space select',
  ];
};

export const selectionListItemSpecComment = (p: Partial<SelectionListItemProps>) => asComment(selectionListItemSpecLines(p));
export const selectionListSpecComment = (p: Partial<SelectionListProps>) => asComment(selectionListSpecLines(p));
