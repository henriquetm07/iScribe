/**
 * Human-readable reference for the Drawer, shown in the Storybook "Show code" panel. Mirrors Drawer.css.
 */
import { asComment } from '../Button/Button.docs';
import type { DrawerDevice } from './DrawerHeader';

const name: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

export const drawerSpecLines = ({ device = 'iphone' }: { device?: DrawerDevice }) => {
  const ipad = device === 'ipad';
  return [
    `Drawer · ${name[device]}`,
    '',
    '  Modal BG    the page dimmed with var(--is-background-modal-background); a tap on it closes the drawer',
    device === 'iphone'
      ? '  Drawer      sheet from the bottom, full width, 634–660px tall, top corners 30px'
      : '  Drawer      panel from the right, full height, up to 500px wide',
    '              elevated background, shadow 0 0 20px basic shadow · slides in/out in 320ms',
    `  Header      Drawer Header (${name[device]}): title, ×, search (with × to clear); no filter button`,
    '  Main area   the content, under the header; scrolls when taller than the drawer',
    '',
    '  Content (Figma "List items"): 20px padding, 10px apart',
    `    Title           Figtree Medium ${ipad ? 17 : 15}px / 18px, e.g. "Added Macros", "All Macros", "Search Results"`,
    `    Macro item      corners 16px, 1px medium contrast line · name Figtree Medium ${ipad ? 16 : 14}px / 20px`,
    `                    section label (${ipad ? 'Big' : 'Small'}, low contrast) · source Relative Mono ${ipad ? 12 : 11}px low contrast`,
    `                    + ${ipad ? 20 : 16}px in a 60px wide area · Added: primary button background, white text, ×`,
    `    Diagnoses item  (Diagnoses and Orders) same card · name, then its label (${ipad ? 'Medium 22px' : 'Small 18px'}): the ICD code or the`,
    '                    order type · Added keeps the label, in its dark version',
    `    No results      50px icon · Figtree Medium ${ipad ? 15 : 13}px, 70px above and below`,
    '',
    '  Adding an item: both wipes play at once, 200ms: its old place closes from bottom to top while the dark',
    '  Added version opens on top of "Added …" from top to bottom; the list moves with them.',
    '  Removing plays the reverse: the Added version closes while the item opens again at its place.',
    '  Closes with ×, a tap on the dimmed page or Escape.',
  ];
};

export const drawerSpecComment = (p: { device?: DrawerDevice }) => asComment(drawerSpecLines(p));
