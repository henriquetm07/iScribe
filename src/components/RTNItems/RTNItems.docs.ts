/**
 * Human-readable reference for RTN Items (Today), shown in the Storybook "Show code" panel. Mirrors RTNItems.css.
 */
import { asComment } from '../Button/Button.docs';
import type { RtnDevice } from './RTNItems';

const isPhone = (d?: RtnDevice) => d === 'iphone';

export const rtnItemSpecLines = ({ device = 'web' }: { device?: RtnDevice }) => [
  `RTN Item (Today) · ${device === 'iphone' ? 'iPhone' : device === 'ipad' ? 'iPad' : 'Web'}`,
  '',
  isPhone(device)
    ? '  Card        padding 10, 10px apart, corners 16px, min height 60px'
    : `  Card        padding 20, 12px apart, corners 20px (Round XXL)${device === 'ipad' ? ', min height 80px' : ', min height 80px once filled'}`,
  '              super-soft contrast background, 1px medium contrast line',
  `  Header      10px side padding · icon ${isPhone(device) ? 16 : 20}px · title Figtree Medium ${isPhone(device) ? 16 : 17}px · counter Relative Mono ${isPhone(device) ? 13 : 15}px low contrast · + ${isPhone(device) ? 16 : 18}px`,
  `  Entry       padding ${isPhone(device) ? 10 : 20}, corners 12px, super-soft contrast light, 1px soft contrast light 2 line; × ${isPhone(device) ? 16 : 20}px ${isPhone(device) ? 20 : 40}px from the content`,
  '',
  '  Content types (Container Content):',
  `    Text           Figtree ${isPhone(device) ? 15 : '15 (Macros) / 17'}px, line height 20`,
  '    Editable Text  the entry on an elevated (white) background',
  `    Editing        text box (elevated, 1px soft line, corners 12, 4 × 8 padding) + Discard (Button destructive-outline) and Save (Button primary), ${isPhone(device) ? 'Regular' : 'Big'}, equal width, 10px apart`,
  '    Image          237 : 180, corners 12, "Add caption" Figtree Medium Italic 13px medium contrast',
  `    Diagnosis      name · ICD code label (${isPhone(device) ? 'Small' : 'Big'}, low contrast) · Toggle ${isPhone(device) ? 'Default' : 'XL'} + "Active problem" Figtree Medium ${isPhone(device) ? 13 : 15}px`,
  `    Order + Label  name, then a red alert label with the alert icon (${isPhone(device) ? 'Medium' : 'Big'})`,
  `    Billing        E&M code (accent label) · Billing Codes (Button secondary ${isPhone(device) ? 'Small' : 'Regular'}, Relative Mono, drag handle + ×) · Add Code (Button primary ${isPhone(device) ? 'Small' : 'Regular'})`,
  '                   Hold the double kebab to pick a code up: it floats above the whole page, tilted 15° around the grab point,',
  '                   6% larger with a shadow and a 5px blur behind it, and leaves a soft placeholder; on release it glides into place',
];

export const rtnItemSpecComment = (props: { device?: RtnDevice }) => asComment(rtnItemSpecLines(props));

export const rtnFrameSpecLines = ({ device = 'web' }: { device?: RtnDevice }) =>
  isPhone(device)
    ? [
        'RTN Main Frame (Today) · iPhone',
        '',
        '  Sheet       elevated background, top corners 30px, 20px side padding, 60px bottom, 20px apart',
        '  Top         dragger 36 × 4 · Tabs (iPhone): Chart Prep · Previous Note · Current Note',
        '  List        RTN Items, 10px apart',
      ]
    : [
        `RTN Main Frame (Today) · ${device === 'ipad' ? 'iPad' : 'Web'}`,
        '',
        '  Panel       elevated background, 1px super-soft line, corners 30px, up to 900px wide',
        `  Tabs        20px padding · Tabs (${device === 'ipad' ? 'iPad' : 'Web'}): Chart Prep · Previous Note · Current Note`,
        '  Note        super-soft contrast background, 20px padding, 10px apart',
        '  List        RTN Items, 20px apart · "Autosaved ✓" Figtree 12px low contrast, right aligned',
      ];

export const rtnFrameSpecComment = (props: { device?: RtnDevice }) => asComment(rtnFrameSpecLines(props));
