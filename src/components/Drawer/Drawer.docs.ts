/**
 * Human-readable reference for the Drawer, shown in the Storybook "Show code" panel. Mirrors Drawer.css.
 */
import { asComment } from '../Button/Button.docs';
import type { DrawerDevice } from './DrawerHeader';

const name: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

export const drawerSpecLines = ({ device = 'iphone', content }: { device?: DrawerDevice; content?: string }) => {
  const ipad = device === 'ipad';
  if (content === 'previous')
    return [
      `Drawer · Add from Previous Note (Checklist) · ${name[device]}`,
      '',
      '  Modal BG    the page dimmed; a tap on it, × or Escape closes the drawer',
      device === 'iphone'
        ? '  Drawer      the Drawer: sheet from the bottom, up to 660px tall'
        : '  Drawer      panel from the right, full height, up to 500px wide',
      `  Header      Drawer Header: icon, "Add from Previous Note" (Season Mix ${ipad ? 24 : 20}px), green count badge`,
      `              (${device === 'iphone' ? '16px, Relative Mono 9px' : '20px, Relative Mono 12px'}), description, ×; no search or filter`,
      '  List        20px padding, rows 10px apart',
      `  Row         Copy from Previous Note Item: ${ipad ? '50px tall, corners 10' : device === 'web' ? 'height from the 30px +, corners 8' : '32px tall, corners 8'}`,
      `              icon ${ipad ? 20 : 16}px (empty for entries under a section) · code label (${ipad ? 'Big 30px' : 'Medium 22px'};`,
      `              billing codes accent) · name Figtree Medium ${ipad ? 17 : 15}px, one line with …`,
      `              + secondary Icon Button ${ipad ? '40px' : device === 'web' ? '30px' : '20px (corners 6)'}`,
      '  Added       Status / Background / Positive (green), dark text, check instead of the +; the badge counts them',
      '              A tap on an added row removes it.',
    ];
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

export const drawerSpecComment = (p: { device?: DrawerDevice; content?: string }) => asComment(drawerSpecLines(p));
