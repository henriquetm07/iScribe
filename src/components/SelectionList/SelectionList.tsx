import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { IconName } from '../../icons/icons';
import { SelectionListItem, type SelectionListDevice } from './SelectionListItem';
import './SelectionList.css';

export interface SelectionListOption {
  /** Unique value reported by onChange */
  value: string;
  /** Text shown in the row */
  label: string;
  /** Red text (e.g. "Remove device") */
  destructive?: boolean;
  /** Optional icon before the label (from Foundations / Icons) */
  iconLeft?: IconName;
  /** Optional icon on the right. On the selected row the check mark is shown instead, as in Selection List Item. */
  iconRight?: IconName;
  /** @deprecated Use iconLeft */
  icon?: IconName;
  disabled?: boolean;
}

export interface SelectionListProps {
  /** The rows, top to bottom */
  options: SelectionListOption[];
  /** The selected value (controlled). Leave undefined to let the list manage it. */
  value?: string | null;
  /** Initially selected value when uncontrolled */
  defaultValue?: string | null;
  /** Called with the value of the row the user picks */
  onChange?: (value: string) => void;
  /** iPhone · iPad · Web row sizes */
  device?: SelectionListDevice;
  /** Show this many rows, then scroll. Leave empty to show every row. */
  visibleRows?: number;
  /** Width of the card (default 300px, as in Figma) */
  width?: number | string;
  /** Accessible name, e.g. "Microphone" */
  'aria-label'?: string;
}

/** Row heights per device, used to size the scroll area for `visibleRows` */
const ROW_HEIGHT: Record<SelectionListDevice, number> = { iphone: 40, ipad: 50, web: 36 };

/**
 * Selection List (Figma "Selection List"): a card of Selection List Items with one selected value.
 * Keyboard: ↑/↓ move, Home/End jump, Enter/Space select. Long lists scroll with the Figma "Scroller".
 */
export const SelectionList = ({
  options,
  value,
  defaultValue = null,
  onChange,
  device = 'iphone',
  visibleRows,
  width = 300,
  'aria-label': ariaLabel,
}: SelectionListProps) => {
  const [inner, setInner] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const [focusIndex, setFocusIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === selected)));
  const [scrolls, setScrolls] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  // Show the Scroller (and its 5px gap) only when the list actually overflows
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const check = () => setScrolls(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [options.length, visibleRows, device]);

  const pick = (option: SelectionListOption) => {
    if (option.disabled) return;
    if (value === undefined) setInner(option.value);
    onChange?.(option.value);
  };

  const move = (to: number) => {
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const next = Math.max(enabled[0], Math.min(enabled[enabled.length - 1], to));
    setFocusIndex(next);
    items.current[next]?.focus();
    items.current[next]?.scrollIntoView({ block: 'nearest' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(focusIndex + 1),
      ArrowUp: () => move(focusIndex - 1),
      Home: () => move(0),
      End: () => move(options.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  // Scroll area height: N rows tall (the card adds its 4px padding around it)
  const maxHeight = visibleRows ? visibleRows * ROW_HEIGHT[device] : undefined;

  return (
    <div
      className={`is-selection-list is-selection-list--${device}${scrolls ? ' is-selection-list--scrolls' : ''}`}
      style={{ width }}
    >
      <div
        ref={scroller}
        className="is-selection-list__items"
        role="listbox"
        aria-label={ariaLabel}
        style={{ maxHeight }}
        onKeyDown={onKeyDown}
      >
        {options.map((option, i) => (
          <SelectionListItem
            key={option.value}
            id={`${id}-${i}`}
            ref={(el) => {
              items.current[i] = el;
            }}
            device={device}
            selected={option.value === selected}
            destructive={option.destructive}
            iconLeft={option.iconLeft ?? option.icon}
            iconRight={option.iconRight}
            disabled={option.disabled}
            tabIndex={i === focusIndex ? 0 : -1}
            onFocus={() => setFocusIndex(i)}
            onClick={() => pick(option)}
          >
            {option.label}
          </SelectionListItem>
        ))}
      </div>
    </div>
  );
};
