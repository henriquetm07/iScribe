import { useState, type ButtonHTMLAttributes, type MouseEvent, type Ref } from 'react';
import './Toggle.css';

export type ToggleSize = 'default' | 'big' | 'xl';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue' | 'children'> {
  /** On or off. Pass it to control the toggle yourself; leave it out and use defaultChecked otherwise. */
  checked?: boolean;
  /** Starting state when the toggle manages itself */
  defaultChecked?: boolean;
  /** Called with the new state when the toggle is flipped */
  onChange?: (checked: boolean) => void;
  /** Figma Size: Default 24 × 14 · Big 30 × 16 · XL 44 × 22 */
  size?: ToggleSize;
  /** What the toggle turns on, e.g. "Notifications". Read by screen readers (the toggle has no visible text). */
  label?: string;
  /** Reference to the underlying <button> (React 19 passes ref as a normal prop) */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Toggle (Figma "Toggle"): an on / off switch. Off is a grey knob on the left; on is a periwinkle knob
 * that slides to the right. Colors come from the Figma Toggle variables, so light and dark mode follow data-theme.
 */
export const Toggle = ({
  checked,
  defaultChecked = false,
  onChange,
  size = 'default',
  label,
  disabled,
  className = '',
  onClick,
  ...props
}: ToggleProps) => {
  const [own, setOwn] = useState(defaultChecked);
  const on = checked ?? own;

  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    if (checked === undefined) setOwn(!on);
    onChange?.(!on);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      className={['is-toggle', `is-toggle--${size}`, on ? 'is-toggle--on' : '', className].filter(Boolean).join(' ')}
      onClick={flip}
      {...props}
    >
      <span className="is-toggle__knob" aria-hidden="true" />
    </button>
  );
};
