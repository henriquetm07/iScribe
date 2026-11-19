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
  className?: string;
}

/**
 * Web Note Bottom Bar — Figma 3624:4200. Web only. A full-width bar on the elevated background, 20px × 40px
 * padding, with the note's next step on the right: a primary XL (60px) pill Button.
 */
export const WebNoteBottomBar = ({ action = 'generate-note', onAction, label, disabled, className }: WebNoteBottomBarProps) => (
  <div className={['is-web-note-bar', className].filter(Boolean).join(' ')}>
    <Button variant="primary" size="xl" rounded disabled={disabled} onClick={() => onAction?.(action)}>
      {label ?? webNoteBottomBarLabels[action]}
    </Button>
  </div>
);
