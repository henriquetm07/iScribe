/** Human-readable reference for the Connectivity Dialog, shown in "Show code". Mirrors ConnectivityDialog.css. */
import { asComment } from '../Button/Button.docs';

export const connectivityDialogSpecComment = () =>
  asComment([
    'Connectivity Dialog · Web',
    '',
    '  Card        600px wide, corners 20px, elevated background, 1px Surface / Soft Contrast edge',
    '  Board       padding 20, gap 12',
    '  Header      icon/connectivity 16px + "Connectivity" Figtree SemiBold 14px, 9px apart',
    '  Group       title Figtree SemiBold 12px, then its rows 5px apart, a 1px soft-contrast separator between them',
    '  Row         status icon 12px, 8px to the host (Relative Mono 12px, high contrast, … when long);',
    '              10px to the result on the right (Relative Mono 12px, medium contrast)',
    '                checking  spinner (Animated Icons) · "-"',
    '                ok        icon/check flat, Status / Foreground Positive · "249 ms"',
    '                error     icon/alert flat, Status / Foreground Alert · "Unreachable (blocked, DNS or TLS)" in alert red',
    '  Footer      1px soft-contrast top edge, padding 20, gap 12: the note (Figtree 12px) · Reprocess',
    '              (Button Secondary Regular, icon/reload)',
  ]);
