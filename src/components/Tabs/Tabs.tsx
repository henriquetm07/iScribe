import { useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react';
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
 * Lens map for the glass: an image whose red/green channels say how far to shift each pixel
 * (128 = no shift). Flat in the middle, strongest at the edges, so text bends at the rim like
 * it would through a thick piece of glass and stays sharp in the centre. Made once, on first use.
 */
let lensMap: string | null = null;
const getLensMap = () => {
  if (lensMap || typeof document === 'undefined') return lensMap;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(size, size);
  const ease = (edge: number, reach: number) => {
    // 1 at the edge, easing to 0 at `reach` (fraction of the half-size) inward
    const t = Math.min(1, edge / reach);
    return (1 - t) * (1 - t);
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size;
      const v = (y + 0.5) / size;
      const dx = Math.sign(0.5 - u) * ease(Math.min(u, 1 - u), 0.32);
      const dy = Math.sign(0.5 - v) * ease(Math.min(v, 1 - v), 0.45);
      const p = (y * size + x) * 4;
      img.data[p] = 128 + Math.round(127 * dx);
      img.data[p + 1] = 128 + Math.round(127 * dy);
      img.data[p + 2] = 128;
      img.data[p + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  lensMap = canvas.toDataURL();
  return lensMap;
};

/** How far (px) the edges bend text: Figma Glass refraction 0.8 × depth 20, kept gentle so text stays readable */
const LENS_STRENGTH = 0.8 * 20 * 0.6;

interface IndicatorBox {
  /** Selected tab, relative to the bar */
  x: number;
  y: number;
  w: number;
  h: number;
  /** The row of tabs, relative to the bar */
  rowX: number;
  rowY: number;
  rowW: number;
  rowH: number;
}

/**
 * Tabs (Figma "Tab"): a rounded bar of equal-width Tab items with one selected.
 * The glass selection indicator slides to the tab the user picks and works like a lens: the labels it
 * passes over bend at its edges. Keyboard: ← / → move and select, Home / End jump.
 */
export const Tabs = ({ options, value, defaultValue, onChange, device = 'iphone', width = '100%', 'aria-label': ariaLabel }: TabsProps) => {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const selected = value !== undefined ? value : inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const filterId = `is-tabs-lens${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [map, setMap] = useState<string | null>(null);
  useEffect(() => setMap(getLensMap()), []);

  // The selection indicator: measured from the selected tab, and moved there with a transition
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);
  const [animate, setAnimate] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[options.findIndex((o) => o.value === selected)];
      const r = row.current;
      setIndicator(
        el && r
          ? {
              x: el.offsetLeft,
              y: el.offsetTop,
              w: el.offsetWidth,
              h: el.offsetHeight,
              rowX: r.offsetLeft,
              rowY: r.offsetTop,
              rowW: r.offsetWidth,
              rowH: r.offsetHeight,
            }
          : null,
      );
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

  const moving = animate ? ' is-tabs--animate' : '';
  // Where the glass sits over the real row: the real labels are hidden there, and the lens copy shows them
  const maskVars = indicator
    ? ({ '--is-tabs-glass-x': `${indicator.x - indicator.rowX}px`, '--is-tabs-glass-w': `${indicator.w}px` } as CSSProperties)
    : undefined;

  return (
    <div
      ref={bar}
      className={`is-tabs is-tabs--${device}${indicator ? ' is-tabs--has-indicator' : ''}${moving}`}
      role="tablist"
      aria-label={ariaLabel}
      style={{ width }}
      onKeyDown={onKeyDown}
    >
      <div ref={row} className="is-tabs__items" style={maskVars}>
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

      {indicator && (
        <span
          className="is-tabs__indicator"
          aria-hidden="true"
          style={{ width: indicator.w, height: indicator.h, transform: `translate(${indicator.x}px, ${indicator.y}px)` }}
        >
          {/* The lens: a copy of the labels, kept aligned with the real ones while the glass moves, bent at the edges */}
          <span className="is-tabs__lens" style={map ? { filter: `url(#${filterId})` } : undefined}>
            <span
              className="is-tabs__lens-row"
              style={{
                width: indicator.rowW,
                height: indicator.rowH,
                transform: `translate(${indicator.rowX - indicator.x - 1}px, ${indicator.rowY - indicator.y - 1}px)`,
              }}
            >
              {options.map((o) => (
                <span key={o.value} className={`is-tab-item is-tab-item--${device}`}>
                  <span className="is-tab-item__label">{o.label}</span>
                  {o.count !== undefined && o.count !== '' && <span className="is-tab-item__badge">{o.count}</span>}
                </span>
              ))}
            </span>
          </span>
        </span>
      )}

      {map && indicator && (
        <svg className="is-tabs__filters" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id={filterId} x="0" y="0" width={indicator.w} height={indicator.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={indicator.w} height={indicator.h} preserveAspectRatio="none" result="lens" />
            <feDisplacementMap in="SourceGraphic" in2="lens" scale={LENS_STRENGTH} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
    </div>
  );
};
