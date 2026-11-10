import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import './SelectionList.css';

export type SelectionListDevice = 'iphone' | 'ipad' | 'web';

export interface SelectionListItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The item text */
  children: ReactNode;
  /** iPhone 40px · iPad 50px · Web 36px tall */
  device?: SelectionListDevice;
  /** Selected: Soft Selection background and a check mark on the right */
  selected?: boolean;
  /** Red text, for actions like "Delete" or "Sign out" */
  destructive?: boolean;
  /** Optional icon before the label (from Foundations / Icons) */
  iconLeft?: IconName;
  /** Optional icon on the right. When the item is selected the check mark is shown instead, unless showCheck is false. */
  iconRight?: IconName;
  /**
   * Icon on the right when selected (default "check"). Pick another icon, or "none" to show no selection icon
   * (the row then keeps its own iconRight).
   */
  selectedIcon?: IconName | 'none';
  /** @deprecated Use selectedIcon="none". Show the check mark on the right when selected (default true) */
  showCheck?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * One row of a Selection List (Figma "Selection List Item").
 * States: default, hover (background on pointer hover), selected and destructive.
 */
export const SelectionListItem = ({
  children,
  device = 'iphone',
  selected = false,
  destructive = false,
  iconLeft,
  iconRight,
  selectedIcon = 'check',
  showCheck = true,
  className,
  type = 'button',
  ...rest
}: SelectionListItemProps) => {
  const selectionIcon = showCheck && selectedIcon !== 'none' ? selectedIcon : undefined;
  const right = selected && selectionIcon ? selectionIcon : iconRight;
  const classes = [
    'is-selection-list-item',
    `is-selection-list-item--${device}`,
    selected && 'is-selection-list-item--selected',
    destructive && 'is-selection-list-item--destructive',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} role="option" aria-selected={selected} className={classes} {...rest}>
      <span className="is-selection-list-item__main">
        {iconLeft && <Icon name={iconLeft} className="is-selection-list-item__icon" />}
        <span className="is-selection-list-item__label">{children}</span>
      </span>
      {right && <Icon name={right} className="is-selection-list-item__icon" />}
    </button>
  );
};
