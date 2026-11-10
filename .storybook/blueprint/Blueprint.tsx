import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './blueprint.css';

/*
 * Blueprint view (toolbar → "Blueprint"). Wraps a story, measures the rendered component and draws its
 * structure on a blueprint grid: size, padding, gaps between parts, corner radius and every iScribe
 * component it is built from (with a link to that component's page). Everything is read from the real
 * DOM and computed styles, so it works for any story without per-component setup.
 */

/* ---------- Which iScribe component an element is ---------- */
type Kind = { name: string; docs: string; match: (el: Element) => boolean; detail?: (el: Element) => string | null };

const KINDS: Kind[] = [
  { name: 'Bottom Tab', docs: 'complex-components-bottom-tab-bottom-tab--docs', match: (e) => e.classList.contains('is-bottom-tab') },
  { name: 'Send Slider', docs: 'complex-components-bottom-tab-send-slider--docs', match: (e) => e.classList.contains('is-send-slider') },
  { name: 'Bottom Tab Alert', docs: 'complex-components-bottom-tab-alert--docs', match: (e) => e.classList.contains('is-bottom-tab-alert') },
  { name: 'Selection List', docs: 'simple-components-selection-list-selection-list--docs', match: (e) => e.classList.contains('is-selection-list') },
  {
    name: 'Selection List Item',
    docs: 'simple-components-selection-list-selection-list-item--docs',
    match: (e) => e.classList.contains('is-selection-list-item'),
  },
  { name: 'Icon Button', docs: 'simple-components-icon-button--docs', match: (e) => e.classList.contains('is-icon-button') },
  {
    name: 'Button',
    docs: 'simple-components-button--docs',
    match: (e) => e.classList.contains('is-button') && !e.classList.contains('is-icon-button'),
  },
  {
    name: 'Animated Icon',
    docs: 'foundations-animated-icons--docs',
    match: (e) => e.hasAttribute('data-animated-icon'),
    detail: (e) => e.getAttribute('data-animated-icon'),
  },
  {
    name: 'Icon',
    docs: 'foundations-icons--docs',
    match: (e) => e.tagName.toLowerCase() === 'svg' && e.hasAttribute('data-icon') && !e.closest('[data-animated-icon]'),
    detail: (e) => e.getAttribute('data-icon'),
  },
];
const KIND_SELECTOR =
  '.is-bottom-tab, .is-send-slider, .is-bottom-tab-alert, .is-selection-list, .is-selection-list-item, .is-button, [data-animated-icon], svg[data-icon]';
const kindOf = (el: Element) => KINDS.find((k) => k.match(el)) ?? null;
const labelOf = (el: Element) => {
  const k = kindOf(el);
  if (!k) return '';
  const d = k.detail?.(el);
  return d ? `${k.name} · ${d}` : k.name;
};

/* ---------- Figma variable names for colors ---------- */
let varCache: { theme: string; byColor: Map<string, string[]> } | null = null;
const normalizeColor = (value: string, probe: HTMLElement) => {
  probe.style.color = '';
  probe.style.color = value;
  return probe.style.color ? getComputedStyle(probe).color : null;
};
const colorVars = () => {
  const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
  if (varCache?.theme === theme) return varCache.byColor;
  const names = new Set<string>();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      for (let i = 0; i < rule.style.length; i++) if (rule.style[i].startsWith('--is-')) names.add(rule.style[i]);
    }
  }
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const root = getComputedStyle(document.documentElement);
  const byColor = new Map<string, string[]>();
  for (const name of names) {
    const raw = root.getPropertyValue(name).trim();
    if (!raw || /^[\d.]+(px|%)?$/.test(raw)) continue;
    const c = normalizeColor(raw, probe);
    if (!c) continue;
    byColor.set(c, [...(byColor.get(c) ?? []), name]);
  }
  probe.remove();
  // Semantic names (Button, Surface, Foreground…) first, raw palette (--is-color-*) last
  for (const list of byColor.values()) list.sort((a, b) => Number(a.startsWith('--is-color-')) - Number(b.startsWith('--is-color-')));
  varCache = { theme, byColor };
  return byColor;
};
const toHex = (rgb: string) => {
  const m = rgb.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!m) return rgb;
  const hex = '#' + [m[1], m[2], m[3]].map((v) => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const a = m[4] === undefined ? 1 : +m[4];
  return a < 1 ? `${hex} @ ${Math.round(a * 100)}%` : hex;
};
const describeColor = (rgb: string) => {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null;
  const names = colorVars().get(rgb);
  return { hex: toHex(rgb), variable: names?.[0] ?? null };
};

/** The --is-* variable a property is actually written with in the CSS (following var() chains like --btn-bg). */
const authoredVar = (el: Element, props: string[]): string | null => {
  const declared = (node: Element, prop: string) => {
    let found: string | null = null;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSStyleRule)) continue;
        const v = rule.style.getPropertyValue(prop);
        if (!v) continue;
        try {
          if (node.matches(rule.selectorText)) found = v;
        } catch {
          /* selector the browser can't match against (e.g. ::before) */
        }
      }
    }
    return found;
  };
  // Only color variables count (a border shorthand also names its width variable)
  const probe = document.createElement('span');
  const isColor = (name: string) => {
    const raw = getComputedStyle(el).getPropertyValue(name).trim();
    probe.style.color = '';
    probe.style.color = raw;
    return raw !== '' && probe.style.color !== '';
  };
  const resolve = (value: string | null, depth: number): string | null => {
    if (!value || depth > 6) return null;
    for (const m of value.matchAll(/var\((--[\w-]+)/g)) {
      const name = m[1];
      if (!isColor(name)) continue;
      if (name.startsWith('--is-')) return name;
      // A local custom property (e.g. --btn-bg): find where it is set on this element or an ancestor
      for (let n: Element | null = el; n; n = n.parentElement) {
        const v = declared(n, name);
        if (v) {
          const r = resolve(v, depth + 1);
          if (r) return r;
          break;
        }
      }
    }
    return null;
  };
  for (const p of props) {
    const v = declared(el, p);
    const r = resolve(v, 0);
    if (r) return r;
  }
  return null;
};

/* ---------- Measurement model ---------- */
type Box = { x: number; y: number; w: number; h: number };
type Band = Box & { value: number; side: 'top' | 'right' | 'bottom' | 'left' };
type Gap = Box & { value: number };
type Part = Box & { label: string; n?: number };
type Spec = { label: string; value: string; variable?: string | null };
type Ref = { label: string; docs: string; size: string; count: number; n: number };
type Model = {
  name: string;
  box: Box;
  radius: number;
  padding: Band[];
  gaps: Gap[];
  parts: Part[];
  others: Part[];
  specs: Spec[];
  refs: Ref[];
};

const px = (v: string) => parseFloat(v) || 0;
const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (n: number) => `${r1(n)}`;

const measure = (stage: HTMLElement, title: string): Model | null => {
  const content = stage.querySelector<HTMLElement>('.bp-content');
  if (!content) return null;
  const isPart = (e: Element) => kindOf(e) !== null && (e as HTMLElement).getBoundingClientRect().width > 0;
  const all = Array.from(content.querySelectorAll(KIND_SELECTOR)).filter(isPart);
  const top = all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
  const target = top[0] as HTMLElement | undefined;
  if (!target) return null;

  const sRect = stage.getBoundingClientRect();
  // Storybook's zoom scales the frame; offsetWidth is a whole number, so round the ratio to avoid 390.2-style noise
  const scale = stage.offsetWidth ? Math.round((sRect.width / stage.offsetWidth) * 100) / 100 || 1 : 1;
  const rel = (r: DOMRect): Box => ({ x: (r.left - sRect.left) / scale, y: (r.top - sRect.top) / scale, w: r.width / scale, h: r.height / scale });

  const box = rel(target.getBoundingClientRect());
  const cs = getComputedStyle(target);

  // Padding bands on the component and on plain layout wrappers inside it (not inside child components)
  const padding: Band[] = [];
  const gaps: Gap[] = [];
  const isInsideChildComponent = (el: Element) => {
    const owner = el.closest(KIND_SELECTOR);
    return owner !== null && owner !== target;
  };
  const containers = [target, ...Array.from(target.querySelectorAll<HTMLElement>('*'))].filter(
    (el) => el === target || (!isInsideChildComponent(el) && !el.matches(KIND_SELECTOR) && el.tagName.toLowerCase() !== 'svg' && !el.closest('svg')),
  );
  for (const el of containers) {
    const s = getComputedStyle(el);
    const b = rel(el.getBoundingClientRect());
    if (b.w <= 0 || b.h <= 0) continue;
    const bt = px(s.borderTopWidth), br = px(s.borderRightWidth), bb = px(s.borderBottomWidth), bl = px(s.borderLeftWidth);
    const p = { top: px(s.paddingTop), right: px(s.paddingRight), bottom: px(s.paddingBottom), left: px(s.paddingLeft) };
    const ix = b.x + bl, iy = b.y + bt, iw = b.w - bl - br, ih = b.h - bt - bb;
    if (p.top) padding.push({ side: 'top', value: p.top, x: ix, y: iy, w: iw, h: p.top });
    if (p.bottom) padding.push({ side: 'bottom', value: p.bottom, x: ix, y: iy + ih - p.bottom, w: iw, h: p.bottom });
    if (p.left) padding.push({ side: 'left', value: p.left, x: ix, y: iy + p.top, w: p.left, h: ih - p.top - p.bottom });
    if (p.right) padding.push({ side: 'right', value: p.right, x: ix + iw - p.right, y: iy + p.top, w: p.right, h: ih - p.top - p.bottom });

    // Gaps between the visible, in-flow children of flex/grid containers
    if (!/flex|grid/.test(s.display)) continue;
    const kids = Array.from(el.children).filter((k) => {
      const ks = getComputedStyle(k);
      const kr = k.getBoundingClientRect();
      return ks.position !== 'absolute' && ks.position !== 'fixed' && kr.width > 0 && kr.height > 0;
    }) as HTMLElement[];
    if (kids.length < 2) continue;
    const column = s.display.includes('flex') ? s.flexDirection.startsWith('column') : false;
    const rects = kids.map((k) => rel(k.getBoundingClientRect())).sort((a, c) => (column ? a.y - c.y : a.x - c.x));
    for (let i = 0; i < rects.length - 1; i++) {
      const a = rects[i], c = rects[i + 1];
      if (column) {
        const g = c.y - (a.y + a.h);
        if (g > 0.5) gaps.push({ value: g, x: Math.min(a.x, c.x), y: a.y + a.h, w: Math.max(a.x + a.w, c.x + c.w) - Math.min(a.x, c.x), h: g });
      } else {
        const g = c.x - (a.x + a.w);
        if (g > 0.5) gaps.push({ value: g, x: a.x + a.w, y: Math.min(a.y, c.y), w: g, h: Math.max(a.y + a.h, c.y + c.h) - Math.min(a.y, c.y) });
      }
    }
  }

  // Components it is built from: outlined if they are its nearest component children, all listed as references
  const inner = Array.from(target.querySelectorAll(KIND_SELECTOR)).filter(isPart);
  const parts: Part[] = inner
    .filter((e) => e.parentElement?.closest(KIND_SELECTOR) === target)
    .map((e) => ({ ...rel(e.getBoundingClientRect()), label: labelOf(e) }));
  const refMap = new Map<string, Ref>();
  for (const e of inner) {
    const k = kindOf(e);
    if (!k) continue;
    const label = labelOf(e);
    const r = e.getBoundingClientRect();
    const existing = refMap.get(label);
    if (existing) existing.count++;
    else refMap.set(label, { label, docs: k.docs, size: `${fmt(r.width / scale)} × ${fmt(r.height / scale)}`, count: 1, n: refMap.size + 1 });
  }
  // Outlined parts carry the same number as their entry in "Built from"
  for (const p of parts) p.n = refMap.get(p.label)?.n;
  const others = top.slice(1).map((e) => ({ ...rel(e.getBoundingClientRect()), label: labelOf(e) }));

  // Specs of the component itself
  const specs: Spec[] = [];
  specs.push({ label: 'Size', value: `${fmt(box.w)} × ${fmt(box.h)} px` });
  const pads = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px);
  if (pads.some(Boolean)) specs.push({ label: 'Padding', value: pads.map(fmt).join(' · ') + ' px  (top · right · bottom · left)' });
  if (/flex|grid/.test(cs.display)) {
    const dir = cs.display.includes('flex') ? (cs.flexDirection.startsWith('column') ? 'vertical' : 'horizontal') : 'grid';
    const gap = px(cs.columnGap) || px(cs.rowGap);
    specs.push({
      label: 'Layout',
      value: `${dir}${gap ? `, ${fmt(gap)} px gap` : ''} · align ${cs.alignItems} · justify ${cs.justifyContent}`,
    });
  }
  const radius = px(cs.borderTopLeftRadius);
  if (radius) specs.push({ label: 'Corner radius', value: radius >= 500 ? `full round (${fmt(radius)} px)` : `${fmt(radius)} px` });
  const bw = px(cs.borderTopWidth) || px(cs.borderBottomWidth);
  if (bw && cs.borderTopStyle !== 'none') {
    const c = describeColor(cs.borderTopColor) ?? describeColor(cs.borderBottomColor);
    const v = authoredVar(target, ['border-top-color', 'border-color', 'border-top', 'border', 'border-bottom']) ?? c?.variable;
    const sides = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(px);
    const where = sides.every((s) => s === sides[0]) ? '' : ` (${['top', 'right', 'bottom', 'left'].filter((_, i) => sides[i]).join(', ')} only)`;
    specs.push({ label: 'Border', value: `${fmt(bw)} px ${cs.borderTopStyle}${where}${c ? ` · ${c.hex}` : ''}`, variable: v });
  }
  const bg = describeColor(cs.backgroundColor);
  specs.push({
    label: 'Background',
    value: bg ? bg.hex : 'none (transparent)',
    variable: bg ? authoredVar(target, ['background-color', 'background']) ?? bg.variable : null,
  });
  // Text spec only when the component has its own text (not text inside nested components)
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  let textEl: Element | null = null;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const parent = n.parentElement;
    if (n.textContent?.trim() && parent && parent.closest(KIND_SELECTOR) === target) {
      textEl = parent;
      break;
    }
  }
  if (textEl) {
    const ts = getComputedStyle(textEl);
    const fg = describeColor(ts.color);
    specs.push({
      label: 'Text',
      value: `${ts.fontFamily.split(',')[0].replace(/["']/g, '')} ${ts.fontWeight} · ${fmt(px(ts.fontSize))} px${fg ? ` · ${fg.hex}` : ''}`,
      variable: fg ? authoredVar(textEl, ['color']) ?? authoredVar(target, ['color']) ?? fg.variable : null,
    });
  }

  const self = kindOf(target);
  return {
    name: self?.name ?? title,
    box,
    radius,
    padding,
    gaps,
    parts,
    others,
    specs,
    refs: [...refMap.values()],
  };
};

/* ---------- Drawing ---------- */
const Chip = ({ x, y, text, anchor = 'middle', tone = 'line' }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; tone?: 'line' | 'pad' | 'gap' | 'part' }) => {
  const w = text.length * 6.2 + 10;
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g className={`bp-chip bp-chip--${tone}`}>
      <rect x={left} y={y - 8} width={w} height={16} rx={4} />
      <text x={left + w / 2} y={y + 3.5} textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

const Overlay = ({ m }: { m: Model }) => {
  const { box } = m;
  // Overall size markers sit further out, leaving room for padding values placed just outside thin bands
  const topY = box.y - 36;
  const leftX = box.x - 48;
  const THIN = 16;
  const padChip = (p: Band) => {
    const thick = p.side === 'top' || p.side === 'bottom' ? p.h : p.w;
    if (thick >= THIN) return { x: p.x + p.w / 2, y: p.y + p.h / 2, anchor: 'middle' as const };
    if (p.side === 'top') return { x: p.x + p.w / 2, y: p.y - 11, anchor: 'middle' as const };
    if (p.side === 'bottom') return { x: p.x + p.w / 2, y: p.y + p.h + 11, anchor: 'middle' as const };
    if (p.side === 'left') return { x: p.x - 4, y: p.y + p.h / 2, anchor: 'end' as const };
    return { x: p.x + p.w + 4, y: p.y + p.h / 2, anchor: 'start' as const };
  };
  return (
    <svg className="bp-overlay" aria-hidden="true">
      <defs>
        <pattern id="bp-hatch-pad" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="bp-hatch bp-hatch--pad" />
        </pattern>
        <pattern id="bp-hatch-gap" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" className="bp-hatch bp-hatch--gap" />
        </pattern>
      </defs>

      {/* Other instances in the same story: outline only */}
      {m.others.map((o, i) => (
        <rect key={`o${i}`} x={o.x} y={o.y} width={o.w} height={o.h} className="bp-other" />
      ))}

      {/* Padding */}
      {m.padding.map((p, i) => (
        <g key={`p${i}`}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} className="bp-pad" />
          {p.w > 0 && p.h > 0 && <Chip {...padChip(p)} text={fmt(p.value)} tone="pad" />}
        </g>
      ))}

      {/* Gaps */}
      {m.gaps.map((g, i) => (
        <g key={`g${i}`}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} className="bp-gap" />
          {/* Narrow gaps get their value just above the gap so it doesn't cover the content */}
          <Chip x={g.x + g.w / 2} y={Math.min(g.w, g.h) >= THIN ? g.y + g.h / 2 : g.w < g.h ? g.y - 11 : g.y + g.h / 2} text={fmt(g.value)} tone="gap" />
        </g>
      ))}

      {/* Nested components: dashed outline + numbered badge (matches "Built from") */}
      {m.parts.map((p, i) => (
        <g key={`c${i}`}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} className="bp-part" />
          <g className="bp-badge">
            <circle cx={p.x} cy={p.y} r={8} />
            <text x={p.x} y={p.y + 3.5} textAnchor="middle">
              {p.n ?? '•'}
            </text>
          </g>
        </g>
      ))}

      {/* Component outline and dimensions */}
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={Math.min(m.radius, box.h / 2, box.w / 2)} className="bp-outline" />
      <line x1={box.x} y1={topY} x2={box.x + box.w} y2={topY} className="bp-dim" />
      <line x1={box.x} y1={topY - 5} x2={box.x} y2={topY + 5} className="bp-dim" />
      <line x1={box.x + box.w} y1={topY - 5} x2={box.x + box.w} y2={topY + 5} className="bp-dim" />
      <Chip x={box.x + box.w / 2} y={topY} text={`${fmt(box.w)}`} />
      <line x1={leftX} y1={box.y} x2={leftX} y2={box.y + box.h} className="bp-dim" />
      <line x1={leftX - 5} y1={box.y} x2={leftX + 5} y2={box.y} className="bp-dim" />
      <line x1={leftX - 5} y1={box.y + box.h} x2={leftX + 5} y2={box.y + box.h} className="bp-dim" />
      <Chip x={leftX} y={box.y + box.h / 2} text={`${fmt(box.h)}`} />
      {m.radius > 0 && <Chip x={box.x + box.w + 8} y={topY} text={m.radius >= 500 ? 'r full' : `r ${fmt(m.radius)}`} anchor="start" />}
    </svg>
  );
};

const Panel = ({ m }: { m: Model }) => (
  <div className="bp-panel">
    <div className="bp-panel__head">
      <span className="bp-panel__tag">Blueprint</span>
      <strong>{m.name}</strong>
    </div>
    <dl className="bp-panel__specs">
      {m.specs.map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>
            {s.value}
            {s.variable && <code>var({s.variable})</code>}
          </dd>
        </div>
      ))}
    </dl>
    <div className="bp-panel__refs">
      <span className="bp-panel__label">Built from</span>
      {m.refs.length ? (
        <ul>
          {m.refs.map((r) => (
            <li key={r.label}>
              <b className="bp-panel__num">{r.n}</b>
              <a href={`/?path=/docs/${r.docs}`} target="_top">
                {r.label} ↗
              </a>
              <span>
                {r.size}
                {r.count > 1 ? ` · ×${r.count}` : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Foundations only (colors, variables and type); it doesn’t contain other components.</p>
      )}
    </div>
    <div className="bp-legend">
      <span className="bp-legend__pad">Padding</span>
      <span className="bp-legend__gap">Gap / spacing</span>
      <span className="bp-legend__part">Nested component</span>
    </div>
  </div>
);

/** Wraps a story when the Blueprint toolbar button is on. */
export const Blueprint = ({ children, title }: { children: ReactNode; title: string }) => {
  const stage = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<Model | null>(null);
  const frame = useRef(0);

  const update = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (stage.current) setModel(measure(stage.current, title));
    });
  }, [title]);

  useLayoutEffect(update, [update]);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const content = el.querySelector('.bp-content');
    const mo = new MutationObserver(update);
    if (content) mo.observe(content, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class', 'data-state'] });
    el.addEventListener('transitionend', update, true);
    window.addEventListener('resize', update);
    // Fonts and lazy content (Lottie) can change sizes after the first paint
    const t = window.setTimeout(update, 400);
    const t2 = window.setTimeout(update, 1200);
    document.fonts?.ready.then(update);
    return () => {
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener('transitionend', update, true);
      window.removeEventListener('resize', update);
      window.clearTimeout(t);
      window.clearTimeout(t2);
      cancelAnimationFrame(frame.current);
    };
  }, [update]);

  return (
    <div className="bp sb-unstyled">
      <div ref={stage} className="bp-stage">
        <div className="bp-content">{children}</div>
        {model && <Overlay m={model} />}
      </div>
      {model ? <Panel m={model} /> : <div className="bp-panel bp-panel--empty">No iScribe component found in this story.</div>}
    </div>
  );
};
