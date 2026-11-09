import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'destructive-outline';

export type ButtonSize = 'mini' | 'small' | 'regular' | 'big' | 'xl' | 'xxl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Height scale: Mini 20 · Small 32 · Regular 40 · Big 50 · XL 60 · XXL 80 */
  size?: ButtonSize;
  /** Fully rounded (pill) corners instead of the size's default radius */
  rounded?: boolean;
  /** Icon shown before the label; sized to the button automatically */
  iconLeft?: ReactNode;
  /** Icon shown after the label; sized to the button automatically */
  iconRight?: ReactNode;
  /** Button label */
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'regular',
  rounded = false,
  iconLeft,
  iconRight,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={[
      'is-button',
      `is-button--${variant}`,
      `is-button--${size}`,
      rounded ? 'is-button--rounded' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {iconLeft && (
      <span className="is-button__icon" aria-hidden="true">
        {iconLeft}
      </span>
    )}
    <span className="is-button__label">{children}</span>
    {iconRight && (
      <span className="is-button__icon" aria-hidden="true">
        {iconRight}
      </span>
    )}
  </button>
);
