import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { Button } from '../Button/Button';
import './Toast.css';

/*
 * Toast — Figma "Toast" (778:7051). iPhone · iPad · Web, in two layouts:
 *   full    — 355px card: icon, message and an action (e.g. "Recording Deleted" · Undo)
 *   compact — a pill that hugs its content: icon and message (e.g. "Sent to EHR")
 */

export type ToastDevice = 'iphone' | 'ipad' | 'web';
export type ToastLayout = 'full' | 'compact';
/** The icon's colour: Status / Foreground Alert or Positive */
export type ToastTone = 'alert' | 'positive';

export const toastLayouts: { value: ToastLayout; label: string }[] = [
  { value: 'full', label: 'Full width' },
  { value: 'compact', label: 'Compact' },
];

/** What each layout shows unless told otherwise (the Figma samples) */
export const toastDefaults: Record<ToastLayout, { icon: IconName; tone: ToastTone; message: string; actionLabel?: string }> = {
  full: { icon: 'trash', tone: 'alert', message: 'Recording Deleted', actionLabel: 'Undo' },
  compact: { icon: 'check-flat', tone: 'positive', message: 'Sent to EHR' },
};

export interface ToastProps {
  device?: ToastDevice;
  /** Full width (with an action) or Compact (a pill) */
  layout?: ToastLayout;
  /** Icon before the message (default: trash for Full width, check flat for Compact) */
  icon?: IconName;
  /** Icon colour (default: alert for Full width, positive for Compact) */
  tone?: ToastTone;
  /** The message (default: "Recording Deleted" / "Sent to EHR") */
  message?: ReactNode;
  /** The action's label, Full width only (default: "Undo"). Pass "" for none. */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Toast: a white card with a 20px soft shadow. Full width: 355px, 20px corners, padding 15 × 20, icon (16 / 20px),
 * the message (Red Hat Text SemiBold 13 / 15px) and a ghost Button (40 / 50px). Compact: a pill (20px corners on
 * Web) hugging the icon (20 / 24px) and the message; 80px tall on iPad and Web.
 */
export const Toast = ({ device = 'iphone', layout = 'full', icon, tone, message, actionLabel, onAction, className = '' }: ToastProps) => {
  const d = toastDefaults[layout];
  const small = device === 'iphone';
  const label = layout === 'full' ? (actionLabel ?? d.actionLabel) : undefined;
  return (
    <div
      className={`is-toast is-toast--${layout} is-toast--${device} is-toast--${tone ?? d.tone} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <Icon name={icon ?? d.icon} size={layout === 'full' ? (small ? 16 : 20) : small ? 20 : 24} className="is-toast__icon" />
      <p className="is-toast__message">{message ?? d.message}</p>
      {label && (
        <Button variant="ghost" size={small ? 'regular' : 'big'} onClick={onAction} className="is-toast__action">
          {label}
        </Button>
      )}
    </div>
  );
};
