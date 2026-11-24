import { useId, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { Button } from '../Button/Button';
import './PopupMessage.css';

/*
 * Popup Message — Figma "Popup Message" (704:6657). iPhone · iPad · Web, in two content styles:
 *   cta  — a grey header (icon + title), the message and two buttons (e.g. "Delete your recording?": Delete · Cancel)
 *   coms — a short notice: icon, title, message, and × to close (e.g. "Payment Failed")
 */

export type PopupMessageDevice = 'iphone' | 'ipad' | 'web';
export type PopupMessageStyle = 'cta' | 'coms';

/** What each content style shows unless told otherwise (the Figma samples) */
export const popupMessageDefaults: Record<
  PopupMessageStyle,
  { icon: IconName; title: string; message: string; mainButton?: string; secondaryButton?: string }
> = {
  cta: {
    icon: 'trash',
    title: 'Delete your recording?',
    message: 'Are you sure you want to delete your current recording? This action cannot be undone.',
    mainButton: 'Cancel',
    secondaryButton: 'Delete',
  },
  coms: {
    icon: 'alert-flat',
    title: 'Payment Failed',
    message: 'Please update your payment method to keep your account active.',
  },
};

export interface PopupMessageProps {
  device?: PopupMessageDevice;
  /** CTA (header, message, buttons) or Coms (a notice with ×) */
  contentStyle?: PopupMessageStyle;
  /** Icon by the title (default: trash for CTA, alert flat for Coms) */
  icon?: IconName;
  title?: ReactNode;
  message?: ReactNode;
  /** CTA: the main button (Primary) — its label, or false to hide it (default "Cancel") */
  mainButton?: string | false;
  /** CTA: the secondary button (Destructive Outline) — its label, or false to hide it (default "Delete") */
  secondaryButton?: string | false;
  onMain?: () => void;
  onSecondary?: () => void;
  /** Coms: the × in the top right corner (shown when this is set) */
  onClose?: () => void;
  className?: string;
}

/**
 * Popup Message: a white card, 16px corners, a 1px medium-contrast edge and a soft shadow (0 2 10, 15% black).
 * CTA (334px wide): a grey 60px header (80px on iPad) with the icon and title (Figtree SemiBold 16 / 17px), then 20px
 * padding with the message (Figtree 14 / 17px, centred) and the buttons 20px apart, each at most 140px (160 on iPad):
 * Destructive Outline and Primary, 40px (60px on iPad). Coms: centred icon (20 / 22px, periwinkle), title (Season
 * Mix 20px) and message (14px) 12px apart; 260px on iPhone, 280px on Web (40px top and bottom), 334 × 200 on iPad;
 * × at the top right.
 */
export const PopupMessage = ({
  device = 'iphone',
  contentStyle = 'cta',
  icon,
  title,
  message,
  mainButton,
  secondaryButton,
  onMain,
  onSecondary,
  onClose,
  className = '',
}: PopupMessageProps) => {
  const d = popupMessageDefaults[contentStyle];
  const id = useId();
  const ipad = device === 'ipad';
  const main = mainButton === false ? null : (mainButton ?? d.mainButton);
  const secondary = secondaryButton === false ? null : (secondaryButton ?? d.secondaryButton);
  const classes = `is-popup is-popup--${contentStyle} is-popup--${device} ${className}`.trim();

  if (contentStyle === 'cta')
    return (
      <section className={classes} role="alertdialog" aria-labelledby={`${id}-t`} aria-describedby={`${id}-m`}>
        <header className="is-popup__header">
          <Icon name={icon ?? d.icon} size={ipad ? 22 : 18} />
          <h2 id={`${id}-t`} className="is-popup__header-title">
            {title ?? d.title}
          </h2>
        </header>
        <div className="is-popup__content">
          <p id={`${id}-m`} className="is-popup__message">
            {message ?? d.message}
          </p>
          {(secondary || main) && (
            <div className="is-popup__ctas">
              {secondary && (
                <Button variant="destructive-outline" size={ipad ? 'xl' : 'regular'} onClick={onSecondary}>
                  {secondary}
                </Button>
              )}
              {main && (
                <Button variant="primary" size={ipad ? 'xl' : 'regular'} onClick={onMain}>
                  {main}
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    );

  return (
    <section className={classes} role="dialog" aria-labelledby={`${id}-t`} aria-describedby={`${id}-m`}>
      <div className="is-popup__content">
        <Icon name={icon ?? d.icon} size={ipad ? 22 : 20} className="is-popup__icon" />
        <h2 id={`${id}-t`} className="is-popup__title">
          {title ?? d.title}
        </h2>
        <p id={`${id}-m`} className="is-popup__message">
          {message ?? d.message}
        </p>
      </div>
      {onClose && (
        <button type="button" className="is-popup__close" aria-label="Close" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
    </section>
  );
};
