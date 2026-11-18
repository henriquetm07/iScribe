/**
 * Human-readable reference for the Drawer Header, shown in the Storybook "Show code" panel. Mirrors DrawerHeader.css.
 */
import { asComment } from '../Button/Button.docs';
import type { DrawerDevice } from './DrawerHeader';

const name: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

export const drawerHeaderSpecLines = ({ device = 'iphone' }: { device?: DrawerDevice }) => {
  const ipad = device === 'ipad';
  return [
    `Drawer Header · ${name[device]}`,
    '',
    `  Header      375px wide, padding 20, 20px apart, min height ${device === 'iphone' ? 60 : 80}px, super-soft contrast background`,
    `  Title       icon ${ipad ? '20 in a 30' : '16 in a 24'}px box, 10px gap · Season Mix ${ipad ? 24 : 20}px high contrast`,
    `              description Figtree ${device === 'web' ? 13 : 15}px medium contrast, ${device === 'iphone' ? 5 : 10}px under the title`,
    '  Close       × 16px, 20px from the top and right',
    `  Search      ${ipad ? 60 : 40}px tall, 12px side padding, corners ${ipad ? 16 : 12}px, 1px soft contrast line,`,
    `              search icon ${ipad ? 30 : 20}px · Figtree Medium ${ipad ? 15 : 14}px medium contrast placeholder`,
    `  Filter      Icon Button secondary ${ipad ? 'XL (60)' : 'Regular (40)'}, 10px from the search`,
    `  Badge       blue (positive) ${device === 'iphone' ? '16px, Relative Mono 9px' : '20px, Relative Mono 12px'}, on the filter's top-right corner`,
  ];
};

export const drawerHeaderSpecComment = (p: { device?: DrawerDevice }) => asComment(drawerHeaderSpecLines(p));
