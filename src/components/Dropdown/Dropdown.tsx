import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { SelectionList, type SelectionListOption } from '../SelectionList/SelectionList';
import type { SelectionListDevice } from '../SelectionList/SelectionListItem';
import './Dropdown.css';

export type DropdownDevice = SelectionListDevice;

export interface DropdownFieldProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The text in the field (the selected option, or a placeholder) */
  children: ReactNode;
  /** Web 28px · iPhone 50px · iPad 60px tall */
  device?: DropdownDevice;
  /** Active: the menu is open (darker background, chevron up) */
  active?: boolean;
  /** Show the text as a placeholder (lower contrast) */
  placeholder?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** The closed field of a Dropdown (Figma "Dropdown", State=Default / Active). */
export const DropdownField = ({
  children,
  device = 'iphone',
  active = false,
  placeholder = false,
  className,
  type = 'button',
  ...rest
}: DropdownFieldProps) => (
  <button
    type={type}
    className={[
      'is-dropdown-field',
      `is-dropdown-field--${device}`,
      active && 'is-dropdown-field--active',
      placeholder && 'is-dropdown-field--placeholder',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    <span className="is-dropdown-field__label">{children}</span>
    <Icon name={active ? 'chevron-up' : 'chevron-down'} className="is-dropdown-field__icon" />
  </button>
);

export interface DropdownProps {
  /** The menu rows, shown in a Selection List when the dropdown is open */
  options: SelectionListOption[];
  /** The selected value (controlled). Leave undefined to let the dropdown manage it. */
  value?: string | null;
  /** Initially selected value when uncontrolled */
  defaultValue?: string | null;
  /** Called with the value of the option the user picks */
  onChange?: (value: string) => void;
  /** Text shown when nothing is selected */
  placeholder?: string;
  /** Web · iPhone · iPad sizes (the menu uses the same device) */
  device?: DropdownDevice;
  /** Width of the field and its menu (default 305px, as in Figma) */
  width?: number | string;
  /** Width of the open menu when it should differ from the field (e.g. a wider list of long names) */
  menuWidth?: number | string;
  /** Open state (controlled). Leave undefined to let the dropdown manage it. */
  open?: boolean;
  /** Start open when uncontrolled */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Rows the menu shows before it scrolls (Selection List visibleRows, default 5) */
  visibleRows?: number;
  /** Icon on the selected row of the menu (Selection List selectedIcon, default "check") */
  selectedIcon?: IconName | 'none';
  disabled?: boolean;
  /** Accessible name, e.g. "Microphone" */
  'aria-label'?: string;
}

/**
 * Dropdown (Figma "Dropdown"): a field that opens a Selection List of options.
 * Click or press ↓ / Enter / Space to open; pick a row to select it and close. Escape or a click outside closes.
 */
export const Dropdown = ({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Select…',
  device = 'iphone',
  width = 305,
  menuWidth,
  open,
  defaultOpen = false,
  onOpenChange,
  visibleRows = 5,
  selectedIcon,
  disabled = false,
  'aria-label': ariaLabel,
}: DropdownProps) => {
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const selected = value !== undefined ? value : innerValue;
  const isOpen = !disabled && (open !== undefined ? open : innerOpen);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const current = options.find((o) => o.value === selected);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // Close on a click outside
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  });

  // When the menu opens from the keyboard, move focus to the selected (or first) row
  const focusMenu = useRef(false);
  useEffect(() => {
    if (!isOpen || !focusMenu.current) return;
    focusMenu.current = false;
    root.current?.querySelector<HTMLElement>('.is-dropdown__menu [role="option"][tabindex="0"]')?.focus();
  }, [isOpen]);

  const pick = (next: string) => {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
    setOpen(false);
    field.current?.focus();
  };

  const onFieldKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      focusMenu.current = true;
      setOpen(true);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false);
      if (e.key === 'Escape') field.current?.focus();
    }
  };

  return (
    <div ref={root} className={`is-dropdown is-dropdown--${device}${isOpen ? ' is-dropdown--open' : ''}`} style={{ width }}>
      <DropdownField
        ref={field}
        device={device}
        active={isOpen}
        placeholder={!current}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={ariaLabel ? `${ariaLabel}: ${current?.label ?? placeholder}` : undefined}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onFieldKeyDown}
      >
        {current?.label ?? placeholder}
      </DropdownField>
      {isOpen && (
        <div
          id={menuId}
          className="is-dropdown__menu"
          style={menuWidth !== undefined ? { width: menuWidth, right: 'auto' } : undefined}
          onKeyDown={onMenuKeyDown}
        >
          {/* The open menu is the Selection List (Components / Selection List) */}
          <SelectionList
            options={options}
            value={selected}
            onChange={pick}
            device={device}
            visibleRows={visibleRows}
            selectedIcon={selectedIcon}
            width="100%"
            aria-label={ariaLabel}
          />
        </div>
      )}
    </div>
  );
};
