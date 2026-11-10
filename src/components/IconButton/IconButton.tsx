import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import '../Button/Button.css';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The icon to show. It is centred and sized to the button automatically. */
  icon: ReactNode;
  /**
   * What the button does, e.g. "Delete note". Icon buttons have no visible text, so this is read
   * by screen readers and shown as a tooltip on hover.
   */
  label: string;
  /** Visual style — the same variants as the Button */
  variant?: ButtonVariant;
  /** Square size: Mini 20 · Small 30 · Regular 40 · Big 50 · XL 60 · XXL 80 */
  size?: ButtonSize;
  /** Fully rounded (circle) instead of the size's default corner radius */
  rounded?: boolean;
}

/**
 * Icon-only button from the SuperConscious design system (Figma "Buttons (Icons)").
 * It shares every color, state, size variable and hover behaviour with the Button
 * (Button.css); IconButton.css only makes it square.
 */
export const IconButton = ({
  icon,
  label,
  variant = 'primary',
  size = 'regular',
  rounded = false,
  className = '',
  type = 'button',
  title,
  ...props
}: IconButtonProps) => (
  <button
    type={type}
    aria-label={label}
    title={title ?? label}
    className={[
      'is-button',
      `is-button--${variant}`,
      `is-button--${size}`,
      rounded ? 'is-button--rounded' : '',
      'is-icon-button',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    <span className="is-button__icon" aria-hidden="true">
      {icon}
    </span>
  </button>
);
