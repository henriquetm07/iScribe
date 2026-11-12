import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import './Tabs.css';

export type TabsDevice = 'iphone' | 'ipad' | 'web';

export interface TabItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The tab label */
  children: ReactNode;
  /** iPhone 40px · iPad 50px · Web 30px tall */
  device?: TabsDevice;
  /** Selected: glass pill */
  selected?: boolean;
  /** Number in a blue badge after the label (Figma "Notification"). Leave empty for none. */
  count?: number | string;
  ref?: Ref<HTMLButtonElement>;
}

// iOS / iPadOS: the selected pill must use the native iOS glass effect (see the note above Tabs), not this CSS imitation.
/** One tab (Figma "Tab item"): a pill that is glass when selected, with an optional count badge. */
export const TabItem = ({ children, device = 'iphone', selected = false, count, className, type = 'button', ...rest }: TabItemProps) => (
  <button
    type={type}
    role="tab"
    aria-selected={selected}
    className={['is-tab-item', `is-tab-item--${device}`, selected && 'is-tab-item--selected', className].filter(Boolean).join(' ')}
    {...rest}
  >
    <TabItemContent count={count}>{children}</TabItemContent>
  </button>
);

const TabItemContent = ({ children, count }: { children: ReactNode; count?: number | string }) => (
  <>
    <span className="is-tab-item__label">{children}</span>
    {count !== undefined && count !== '' && <span className="is-tab-item__badge">{count}</span>}
  </>
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
  /** Liquid glass: how strongly the glass bends what is under its edges (0 = flat, 40 = strong). Default 22. */
  refraction?: number;
  /** Liquid glass: how much the lens enlarges the selected label (1 = none, 1.25 = 25% larger). Default 1.05. */
  lens?: number;
  /** Liquid glass: how much the glass stretches while it moves and wobbles when it lands (0 = rigid, 1 = very elastic). Default 0.6. */
  elasticity?: number;
  /** Accessible name, e.g. "Patients and jobs" */
  'aria-label'?: string;
}

/*
 * iOS and iPadOS (iPhone and iPad apps): do NOT port this web glass. Build the selection indicator with the
 * native iOS glass effect (Liquid Glass, iOS 26+) so it gets the system's real refraction, lighting and motion:
 *   SwiftUI — wrap the tabs in GlassEffectContainer and give the indicator
 *             .glassEffect(.regular.interactive(), in: .capsule),
 *             moving it between tabs with .glassEffectID(_:in:) so the system morphs it.
 *   UIKit   — a UIVisualEffectView with UIGlassEffect (isInteractive = true).
 * Keep the sizes and colors from Figma; let the system draw the glass itself.
 * This web version (CSS + SVG liquid glass) is only for the browser.
 */

/**
 * Displacement map for a pill: pixels near the edge sample inward, so the edge bends like a convex lens.
 * Red = x offset, green = y offset (128 = none).
 */
const makeLensMap = (w: number, h: number, edge: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const r = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const dx = px - Math.min(Math.max(px, r), w - r);
      const dy = py - h / 2;
      const dist = Math.hypot(dx, dy) || 1e-6;
      const inside = r - dist;
      let ox = 0;
      let oy = 0;
      if (inside > 0) {
        const m = Math.pow(Math.min(Math.max(1 - inside / edge, 0), 1), 2.2);
        ox = -(dx / dist) * m;
        oy = -(dy / dist) * m;
      }
      const i = (y * w + x) * 4;
      img.data[i] = 128 + ox * 127;
      img.data[i + 1] = 128 + oy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
};

/** Share of the refraction applied to the labels inside the glass, so they stay readable */
const LABEL_REFRACTION = 0.2;

/**
 * Tabs (Figma "Tab"): a rounded bar of equal-width Tab items with one selected.
 *
 * The selection is a liquid glass indicator:
 *   - refraction: its edges bend the labels under them (SVG displacement map)
 *   - lens: inside it, the selected label is a slightly enlarged copy
 *   - elasticity: it moves on a spring, stretches in the direction it travels and wobbles as it lands
 *   - it can be dragged; it swells a little while held, and drops on the nearest tab
 *   - its highlight follows the pointer
 * Keyboard: ← / → move and select, Home / End jump. With reduced motion it jumps without stretching.
 */
export const Tabs = ({
  options,
  value,
  defaultValue,
  onChange,
  device = 'iphone',
  width = '100%',
  refraction = 22,
  lens = 1.05,
  elasticity = 0.6,
  'aria-label': ariaLabel,
}: TabsProps) => {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const selected = value !== undefined ? value : inner;
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === selected));

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filterId = `is-tabs-lens-${uid}`;

  const bar = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const clone = useRef<HTMLSpanElement>(null);
  const rim = useRef<HTMLSpanElement>(null);
  const filter = useRef<SVGFilterElement>(null);
  const feImage = useRef<SVGFEImageElement>(null);
  const feDisplace = useRef<SVGFEDisplacementMapElement>(null);
  const [measured, setMeasured] = useState(false);

  // Everything the animation reads lives in one ref, so it runs without re-rendering React
  const sim = useRef({
    slots: [] as { c: number; top: number; w: number; h: number }[],
    x: 0,
    v: 0,
    target: 0,
    press: 1,
    pressTarget: 1,
    raf: 0,
    last: 0,
    dragging: false,
    moved: false,
    dragOffset: 0,
    settings: { refraction, lens, elasticity },
  });
  sim.current.settings = { refraction, lens, elasticity };

  const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /** Draw the indicator, the lens copy, the mask over the real labels and the refraction strength */
  const render = useCallback(() => {
    const s = sim.current;
    const slot = s.slots[0];
    if (!slot || !indicator.current) return;
    const { refraction: refract, lens: mag, elasticity: stretch } = s.settings;
    // The tabs share the width equally, so any slot gives the glass size
    const tabW = slot.w;
    const h = slot.h;
    const midY = slot.top + h / 2;
    const st = reduced() ? 0 : stretch;
    const speed = Math.abs(s.v);
    const sx = Math.min(speed * 0.0007 * st, 0.45 * st);
    const sy = Math.min(speed * 0.00035 * st, 0.16 * st);
    const w = tabW * (1 + sx) * s.press;
    const hh = h * (1 - sy) * (s.press > 1 ? 1 + (s.press - 1) * 1.4 : 1);
    const left = s.x - w / 2;
    const top = midY - hh / 2;

    const ind = indicator.current.style;
    ind.width = `${w}px`;
    ind.height = `${hh}px`;
    ind.transform = `translate(${left}px, ${top}px)`;

    if (clone.current) {
      const scale = mag * (1 + (s.press - 1) * 0.5);
      clone.current.style.transform = `translate(${-left}px, ${-top}px) scale(${scale})`;
      clone.current.style.transformOrigin = `${s.x}px ${midY}px`;
    }
    // Hide the real labels where the glass is; the lens copy shows them instead
    if (items.current) {
      const ox = items.current.offsetLeft;
      const m = `linear-gradient(90deg, #000 ${left - ox + 1}px, transparent ${left - ox + 1}px, transparent ${left - ox + w - 1}px, #000 ${left - ox + w - 1}px)`;
      items.current.style.webkitMaskImage = m;
      items.current.style.maskImage = m;
    }
    // Refraction grows while the glass is held
    const strength = refract * (1 + (s.press - 1) * 2) * LABEL_REFRACTION;
    for (const n of [filter.current, feImage.current]) {
      n?.setAttribute('width', `${w}`);
      n?.setAttribute('height', `${hh}`);
    }
    feDisplace.current?.setAttribute('scale', `${strength}`);
  }, []);

  const step = useCallback(
    (now: number) => {
      const s = sim.current;
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      if (reduced() && !s.dragging) {
        s.x = s.target;
        s.v = 0;
      } else {
        // Spring: stiffer while dragged; elsewhere a little under-damped so it wobbles as it lands
        const k = s.dragging ? 900 : 300;
        // damping ratio: 1 = no wobble (elasticity 0) … 0.37 = lively (elasticity 1); 0.62 at the default 0.6
        const damping = s.dragging ? 0.8 : 1 - 0.63 * s.settings.elasticity;
        const c = 2 * Math.sqrt(k) * damping;
        const a = k * (s.target - s.x) - c * s.v;
        s.v += a * dt;
        s.x += s.v * dt;
      }
      s.press += (s.pressTarget - s.press) * Math.min(1, dt * 14);
      render();
      const settled = Math.abs(s.v) < 2 && Math.abs(s.target - s.x) < 0.3 && Math.abs(s.pressTarget - s.press) < 0.002;
      if (settled && !s.dragging) {
        s.x = s.target;
        s.v = 0;
        s.press = s.pressTarget;
        render();
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(step);
    },
    [render],
  );

  const kick = useCallback(() => {
    const s = sim.current;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(step);
    }
  }, [step]);

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  // Measure the tabs (and rebuild the lens map) whenever the layout can change
  useLayoutEffect(() => {
    const measure = () => {
      const s = sim.current;
      s.slots = tabs.current.map((t) =>
        t ? { c: t.offsetLeft + t.offsetWidth / 2, top: t.offsetTop, w: t.offsetWidth, h: t.offsetHeight } : { c: 0, top: 0, w: 0, h: 0 },
      );
      const slot = s.slots[selectedIndex];
      if (!slot || !slot.w) return;
      s.x = s.target = slot.c;
      s.v = 0;
      if (clone.current && bar.current) {
        // The copy inside the lens uses the bar's exact box, so its labels line up with the real ones
        const cs = getComputedStyle(bar.current);
        clone.current.style.width = `${bar.current.clientWidth}px`;
        clone.current.style.height = `${bar.current.clientHeight}px`;
        clone.current.style.padding = cs.padding;
      }
      feImage.current?.setAttribute('href', makeLensMap(Math.round(slot.w), Math.round(slot.h), Math.min(16, slot.h * 0.45)));
      setMeasured(true);
      render();
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bar.current) ro.observe(bar.current);
    return () => ro.disconnect();
    // selectedIndex is read once per layout; moving between tabs is handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, device, width, render]);

  // A new selection: send the glass there on the spring
  useEffect(() => {
    const s = sim.current;
    const slot = s.slots[selectedIndex];
    if (!slot || s.dragging) return;
    s.target = slot.c;
    kick();
  }, [selectedIndex, kick]);

  // Slider changes in the docs redraw at once
  useEffect(() => {
    render();
  }, [refraction, lens, elasticity, render]);

  const pick = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const at = enabled.indexOf(selectedIndex);
    const to =
      e.key === 'ArrowRight' ? enabled[(at + 1) % enabled.length]
      : e.key === 'ArrowLeft' ? enabled[(at - 1 + enabled.length) % enabled.length]
      : e.key === 'Home' ? enabled[0]
      : e.key === 'End' ? enabled[enabled.length - 1]
      : undefined;
    if (to === undefined) return;
    e.preventDefault();
    pick(options[to].value);
    tabs.current[to]?.focus();
  };

  // Drag the glass: press on it, slide, release over a tab
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    const r = bar.current?.getBoundingClientRect();
    const slot = s.slots[selectedIndex];
    if (!r || !slot) return;
    const px = e.clientX - r.left;
    s.moved = false;
    if (Math.abs(px - s.x) < slot.w / 2) {
      s.dragging = true;
      s.dragOffset = px - s.x;
      bar.current?.setPointerCapture(e.pointerId);
      s.pressTarget = 1.12;
      kick();
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    const r = bar.current?.getBoundingClientRect();
    if (!r || !s.slots.length) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const slot = s.slots[selectedIndex] ?? s.slots[0];
    // The highlight follows the pointer
    rim.current?.style.setProperty('--mx', `${((px - (s.x - slot.w / 2)) / slot.w) * 100}%`);
    rim.current?.style.setProperty('--my', `${(py / r.height) * 100 - 40}%`);
    if (!s.dragging) return;
    const first = s.slots[0];
    const last = s.slots[s.slots.length - 1];
    const nx = Math.min(Math.max(px - s.dragOffset, first.c - first.w * 0.25), last.c + last.w * 0.25);
    if (Math.abs(nx - s.target) > 2) s.moved = true;
    s.target = nx;
    kick();
  };
  const endDrag = () => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.pressTarget = 1;
    // Drop on the nearest enabled tab
    let best = selectedIndex;
    let dist = Infinity;
    s.slots.forEach((slot, i) => {
      if (options[i]?.disabled) return;
      const d = Math.abs(slot.c - s.target);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    s.target = s.slots[best].c;
    kick();
    if (best !== selectedIndex) pick(options[best].value);
    window.setTimeout(() => {
      s.moved = false;
    }, 0);
  };

  return (
    <div
      ref={bar}
      className={`is-tabs is-tabs--${device}${measured ? ' is-tabs--has-indicator' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
      style={{ width }}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={items} className="is-tabs__items">
        {options.map((o, i) => (
          <TabItem
            key={o.value}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            device={device}
            selected={o.value === selected}
            count={o.count}
            disabled={o.disabled}
            tabIndex={o.value === selected ? 0 : -1}
            onClick={() => {
              if (!sim.current.moved) pick(o.value);
            }}
          >
            {o.label}
          </TabItem>
        ))}
      </div>

      <span ref={indicator} className="is-tabs__indicator" aria-hidden="true" hidden={!measured}>
        <span className="is-tabs__glass" />
        <span className="is-tabs__lens" style={{ filter: `url(#${filterId})` }}>
          <span ref={clone} className="is-tabs__clone">
            {options.map((o, i) => (
              <span
                key={o.value}
                className={['is-tab-item', `is-tab-item--${device}`, i === selectedIndex && 'is-tab-item--lens', o.disabled && 'is-tab-item--disabled']
                  .filter(Boolean)
                  .join(' ')}
              >
                <TabItemContent count={o.count}>{o.label}</TabItemContent>
              </span>
            ))}
          </span>
        </span>
        <span ref={rim} className="is-tabs__rim" />
        <span className="is-tabs__rim2" />
      </span>

      {/* The lens: an SVG displacement filter shaped like the pill */}
      <svg className="is-tabs__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter
          ref={filter}
          id={filterId}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="40"
          colorInterpolationFilters="sRGB"
        >
          <feImage ref={feImage} x="0" y="0" width="100" height="40" preserveAspectRatio="none" result="map" />
          <feDisplacementMap ref={feDisplace} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );

};
