import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import './Tabs.css';

export type TabsDevice = 'iphone' | 'ipad' | 'web';

export interface TabItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The tab label */
  children: ReactNode;
  /** iPhone 40px · iPad 50px · Web 30px tall */
  device?: TabsDevice;
  /** Selected: periwinkle pill */
  selected?: boolean;
  /** Number in a blue badge after the label (Figma "Notification"). Leave empty for none. */
  count?: number | string;
  ref?: Ref<HTMLButtonElement>;
}

/** One tab (Figma "Tab item"): a pill that is periwinkle glass when selected, with an optional count badge. */
export const TabItem = ({ children, device = 'iphone', selected = false, count, className, type = 'button', ...rest }: TabItemProps) => (
  <button
    type={type}
    role="tab"
    aria-selected={selected}
    className={['is-tab-item', `is-tab-item--${device}`, selected && 'is-tab-item--selected', className].filter(Boolean).join(' ')}
    {...rest}
  >
    <span className="is-tab-item__label">{children}</span>
    {count !== undefined && count !== '' && <span className="is-tab-item__badge">{count}</span>}
  </button>
);

export interface TabsOption {
  /** Unique value reported by onChange */
  value: string;
  /** Text of the tab */
  label: string;
  /** Optional count badge */
  count?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  /** The tabs, left to right */
  options: TabsOption[];
  /** The selected tab (controlled). Leave undefined to let Tabs manage it. */
  value?: string;
  /** Initially selected tab when uncontrolled (default: the first) */
  defaultValue?: string;
  /** Called with the value of the tab the user picks */
  onChange?: (value: string) => void;
  /** iPhone · iPad · Web sizes */
  device?: TabsDevice;
  /** Width of the bar; the tabs share it equally (default: fill the container) */
  width?: number | string;
  /** Accessible name, e.g. "Patients and jobs" */
  'aria-label'?: string;
}

/**
 * Tabs (Figma "Tab"): a rounded bar of equal-width Tab items with one selected.
 * The glass selection indicator slides to the tab the user picks. Keyboard: ← / → move and select, Home / End jump.
 */
export const Tabs = ({ options, value, defaultValue, onChange, device = 'iphone', width = '100%', 'aria-label': ariaLabel }: TabsProps) => {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const selected = value !== undefined ? value : inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);

  // The selection indicator: measured from the selected tab, and moved there with a transition
  const [indicator, setIndicator] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[options.findIndex((o) => o.value === selected)];
      setIndicator(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bar.current) ro.observe(bar.current);
    return () => ro.disconnect();
  }, [selected, options, device, width]);
  // Start animating only after the first position is drawn, so it doesn't slide in on load
  useEffect(() => {
    if (!indicator || animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [indicator, animate]);
  // Each new selection plays a small "settle": the indicator inflates a touch as it arrives, then eases back
  const [settle, setSettle] = useState(0);
  const lastSelected = useRef(selected);
  useEffect(() => {
    if (lastSelected.current === selected) return;
    lastSelected.current = selected;
    if (animate) setSettle((n) => n + 1);
  }, [selected, animate]);

  const pick = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const at = enabled.indexOf(options.findIndex((o) => o.value === selected));
    const to =
      e.key === 'ArrowRight' ? enabled[(at + 1) % enabled.length]
      : e.key === 'ArrowLeft' ? enabled[(at - 1 + enabled.length) % enabled.length]
      : e.key === 'Home' ? enabled[0]
      : e.key === 'End' ? enabled[enabled.length - 1]
      : undefined;
    if (to === undefined) return;
    e.preventDefault();
    pick(options[to].value);
    refs.current[to]?.focus();
  };

  return (
    <div
      ref={bar}
      className={`is-tabs is-tabs--${device}${indicator ? ' is-tabs--has-indicator' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
      style={{ width }}
      onKeyDown={onKeyDown}
    >
      {indicator && (
        <span
          className={`is-tabs__indicator${animate ? ' is-tabs__indicator--animate' : ''}${
            settle ? ` is-tabs__indicator--settle-${settle % 2 ? 'a' : 'b'}` : ''
          }`}
          aria-hidden="true"
          style={{ width: indicator.w, height: indicator.h, transform: `translate(${indicator.x}px, ${indicator.y}px)` }}
        />
      )}
      {options.map((o, i) => (
        <TabItem
          key={o.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          device={device}
          selected={o.value === selected}
          count={o.count}
          disabled={o.disabled}
          tabIndex={o.value === selected ? 0 : -1}
          onClick={() => pick(o.value)}
        >
          {o.label}
        </TabItem>
      ))}
    </div>
  );
};
