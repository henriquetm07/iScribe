/** Human-readable reference for the Web Note Bottom Bar, shown in "Show code". Mirrors WebNoteBottomBar.css. */
import { asComment } from '../Button/Button.docs';
import { webNoteBottomBarLabels, type WebNoteBottomBarAction } from './WebNoteBottomBar';

export const webNoteBottomBarSpecComment = (action: WebNoteBottomBarAction = 'generate-note') =>
  asComment([
    `Web Note Bottom Bar · ${webNoteBottomBarLabels[action]} · Web`,
    '',
    '  Bar         full width, var(--is-background-elevated-background), padding 20px 40px, button on the right',
    `  Button      Button primary, XL (60px), rounded (pill): "${webNoteBottomBarLabels[action]}"`,
    '              Figtree SemiBold 15px, 20px side padding',
    '  Steps       Generate Note → Mark as Complete → Send to EHR',
    '  Done        Button ghost, XL, rounded, disabled: "Sent to EHR at 2:51 PM, November 2026" / "Marked as Complete at …"',
  ]);
