import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import './WebNoteBottomBar.css';

/** The note's next step: the bar's single action */
export type WebNoteBottomBarAction = 'generate-note' | 'mark-as-complete' | 'send-to-ehr';

export const webNoteBottomBarLabels: Record<WebNoteBottomBarAction, string> = {
  'generate-note': 'Generate Note',
  'mark-as-complete': 'Mark as Complete',
  'send-to-ehr': 'Send to EHR',
};

/** What the bar says once the final step is done */
export const webNoteBottomBarDone: Partial<Record<WebNoteBottomBarAction, string>> = {
  'send-to-ehr': 'Sent to EHR',
  'mark-as-complete': 'Marked as Complete',
};

/** "2:51 PM, November 19, 2026" */
export const formatDoneAt = (d: Date) =>
  `${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}, ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

/** The order the actions come in, from a recorded visit to a note in the EHR */
export const webNoteBottomBarSteps: WebNoteBottomBarAction[] = ['generate-note', 'mark-as-complete', 'send-to-ehr'];

export interface WebNoteBottomBarProps {
  /** Generate Note · Mark as Complete · Send to EHR */
  action?: WebNoteBottomBarAction;
  /** Called by the button */
  onAction?: (action: WebNoteBottomBarAction) => void;
  /** Replace the button's label */
  label?: ReactNode;
  disabled?: boolean;
  /**
   * When the action was done (Send to EHR or Mark as Complete): the button becomes a ghost, blocked button that says
   * "Sent to EHR at 2:51 PM, November 19, 2026" or "Marked as Complete at …".
   */
  doneAt?: Date;
  className?: string;
}

/**
 * Web Note Bottom Bar — Figma 3624:4200. Web only. A full-width bar on the elevated background, 20px × 40px
 * padding, with the note's next step on the right: a primary XL (60px) pill Button.
 */
export const WebNoteBottomBar = ({ action = 'generate-note', onAction, label, disabled, doneAt, className }: WebNoteBottomBarProps) => {
  const done = doneAt && webNoteBottomBarDone[action];
  return (
    <div className={['is-web-note-bar', className].filter(Boolean).join(' ')}>
      {done ? (
        <Button variant="ghost" size="xl" rounded disabled className="is-web-note-bar__done">
          {`${done} at ${formatDoneAt(doneAt)}`}
        </Button>
      ) : (
        <Button variant="primary" size="xl" rounded disabled={disabled} onClick={() => onAction?.(action)}>
          {label ?? webNoteBottomBarLabels[action]}
        </Button>
      )}
    </div>
  );
};
