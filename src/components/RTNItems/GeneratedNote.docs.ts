/**
 * Human-readable reference for the Generated Note (RTN Notes), shown in the Storybook "Show code" panel.
 * Mirrors GeneratedNote.css. Web only.
 */
import { asComment } from '../Button/Button.docs';

const itemLines = [
  '  Card        var(--is-background-elevated-background), 20px corners, padding 10px 12px, 10px gaps',
  '  Header      title Figtree Medium 16px · Copy Icon Button (secondary, Regular 40px); a check once copied',
  '  Divider     1px var(--is-surface-soft-contrast-background)',
  '  Text        Figtree Regular 13px, line height 1.3, line breaks kept',
];

export const generatedNoteItemSpecComment = () => asComment(['RTN Item (Generated Note) · Web', '', ...itemLines]);

export const generatedNoteFrameSpecComment = (tab: string) =>
  asComment([
    `RTN Main Frame (Generated Note) · Web · ${tab === 'transcript' ? 'Transcript' : 'Note'}`,
    '',
    '  Panel       RTN Main Frame: elevated background, 30px corners, 1px super soft contrast border, up to 900px',
    '  Top         20px padding · Tabs (Web, 240px): Transcript · Note · Button secondary Regular with copy icon:',
    '              "Copy Transcript" on Transcript, "Copy All" on Note ("Copied" with a check for a moment)',
    '  Body        var(--is-surface-super-soft-contrast-background), 20px padding',
    tab === 'transcript'
      ? '  Search      40px, elevated background, 12px corners, 20px magnifier, Red Hat Text Medium 13px;\n' +
        '              highlights the matches and hides the lines without any\n' +
        '  Transcript  Red Hat Text Regular 15px, line height 1.3, "[hh:mm:ss] text", a blank line between'
      : '  Sections    RTN Item (Generated Note) cards, 20px apart',
    ...(tab === 'transcript' ? [] : ['', ...itemLines]),
  ]);
