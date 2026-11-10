/**
 * Human-readable reference for the Web Nav Bar, shown in the Storybook "Show code" panel.
 * Mirrors WebNavBar.css and names the library components each part is built from.
 */
import { asComment } from '../Button/Button.docs';
import type { WebNavBarProps } from './WebNavBar';

export const webNavBarSpecLines = (p: Partial<WebNavBarProps>) => {
  const mode = p.menu ?? 'auto';
  return [
    `Web Nav Bar · menu: ${mode === 'auto' ? 'auto (compacts when too narrow)' : mode}`,
    '',
    'BAR',
    '  Height      52px, full width; padding 10px 20px',
    '  Background  var(--is-background-elevated-background)',
    '  Border      1px bottom, var(--is-surface-medium-contrast-background)',
    '',
    'LEFT (40px gap)',
    '  Logo        iScribe logo, 68 × 24px, currentColor',
    '  Menu        <Button variant="ghost" size="small" /> per item, 10px apart;',
    '              the current page uses the ghost active background (data-state="active")',
    '  Compressed  when the menu does not fit: <Button ghost small> with <Icon name="sandwich" />',
    '              and the current page, opening a <SelectionList device="web" /> of the items',
    '',
    'RIGHT (18px gap)',
    '  <Button variant="secondary" size="small"> Chrome icon + "Download Chrome Extension"',
    '  1px divider, var(--is-surface-medium-contrast-background)',
    '  Then 10px apart:',
    '    <Dropdown device="web" width={220} menuWidth={310} />  practices',
    '    Avatar      30px, var(--is-round-s), initials on var(--is-labels-accent) under the photo;',
    '                opens a <SelectionList device="web" /> (My Account, Log Out)',
    '    <IconButton variant="ghost" size="small" icon="search" />',
    '    <IconButton variant="ghost" size="small" icon="connectivity" /> + 12px "alert-flat" badge',
    '              in var(--is-status-foreground-alert) when connectivityAlert',
  ];
};

export const webNavBarSpecComment = (p: Partial<WebNavBarProps>) => asComment(webNavBarSpecLines(p));
