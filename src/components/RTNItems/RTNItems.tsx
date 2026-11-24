import { Children, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { AnimatedIcon } from '../../icons/AnimatedIcon';
import type { IconName } from '../../icons/icons';
import { Button } from '../Button/Button';
import { Tabs, type TabsOption } from '../Tabs/Tabs';
import { Toggle } from '../Toggle/Toggle';
import { createPortal } from 'react-dom';
import { PreviousNoteSummary } from './PreviousNote';
import './RTNItems.css';

/** Figma Device: iPhone · iPad · Web. Web and iPad share sizes; Web drops the 80px minimum height when empty. */
export type RtnDevice = 'iphone' | 'ipad' | 'web';

/** Figma Topic */
export type RtnTopic = 'macros' | 'pro-doc' | 'diagnoses' | 'orders' | 'billing';

export const rtnTopics: { value: RtnTopic; label: string; icon: IconName }[] = [
  { value: 'macros', label: 'Macros', icon: 'macros' },
  { value: 'pro-doc', label: 'Procedure Documentation', icon: 'documentation' },
  { value: 'diagnoses', label: 'Diagnoses', icon: 'diagnosis' },
  { value: 'orders', label: 'Orders', icon: 'order' },
  { value: 'billing', label: 'Billing', icon: 'billing' },
];

const topicOf = (t: RtnTopic) => rtnTopics.find((x) => x.value === t) ?? rtnTopics[0];
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');
const small = (device: RtnDevice) => device === 'iphone';

/* ------------------------------------------------------------------ Counter + header */

/** Counter Label (Figma "Label", 738:6481): the number of items next to a topic title. */
export const RtnCounter = ({ device = 'web', count }: { device?: RtnDevice; count: number | string }) => (
  <span className={cx('is-rtn-counter', `is-rtn-counter--${device}`)}>{count}</span>
);

export interface RtnItemHeaderProps {
  device?: RtnDevice;
  topic: RtnTopic;
  /** Overrides the topic's title */
  title?: string;
  count?: number | string;
  /** Called when + is pressed */
  onAdd?: () => void;
  /** Filling in (e.g. from a recording): the spinner (Animated Icons) takes the place of the + */
  loading?: boolean;
}

/** RTN Item Header (Today), 738:6485: topic icon, title, counter and the + button (or the spinner while loading). */
export const RtnItemHeader = ({ device = 'web', topic, title, count = 0, onAdd, loading = false }: RtnItemHeaderProps) => {
  const t = topicOf(topic);
  const iconSize = small(device) ? 16 : 20;
  return (
    <div className={cx('is-rtn-header', `is-rtn-header--${device}`)}>
      <div className="is-rtn-header__label">
        <Icon name={t.icon} size={iconSize} className="is-rtn-header__icon" />
        <span className="is-rtn-header__title">{title ?? t.label}</span>
        <RtnCounter device={device} count={count} />
      </div>
      {loading ? (
        <span className="is-rtn-header__loading" role="status">
          <AnimatedIcon name="spinner" size={small(device) ? 16 : 18} title={`Loading ${title ?? t.label}`} />
        </span>
      ) : (
        <button type="button" className="is-rtn-icon-action is-rtn-header__add" aria-label={`Add to ${title ?? t.label}`} onClick={onAdd}>
          <Icon name="add" size={small(device) ? 16 : 18} />
        </button>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ Content box */

export interface RtnItemContentProps {
  device?: RtnDevice;
  /** Elevated (white) background, as the Editable Text box in Figma */
  elevated?: boolean;
  /** Called when × is pressed; leave it out to hide the × */
  onRemove?: () => void;
  removeLabel?: string;
  /** Gap between the content and the ×: 40 (iPad / Web), 20 (iPhone). Billing uses 10. */
  tightClose?: boolean;
  children: ReactNode;
  className?: string;
}

/** RTN Item Content, 765:701: one entry inside a topic card, with the × on the right. */
export const RtnItemContent = ({ device = 'web', elevated, onRemove, removeLabel = 'Remove', tightClose, children, className }: RtnItemContentProps) => (
  <div className={cx('is-rtn-content', `is-rtn-content--${device}`, elevated && 'is-rtn-content--elevated', tightClose && 'is-rtn-content--tight', className)}>
    <div className="is-rtn-content__body">{children}</div>
    {onRemove && (
      <button type="button" className="is-rtn-icon-action is-rtn-content__close" aria-label={removeLabel} onClick={onRemove}>
        <Icon name="close" size={small(device) ? 16 : 20} />
      </button>
    )}
  </div>
);

/* ------------------------------------------------------------------ Labels */

export type RtnLabelTone = 'neutral' | 'accent' | 'alert' | 'plain';

/** Figma "Label" used inside RTN items: a pill with a code in Relative Mono. */
export const RtnLabel = ({ device = 'web', tone = 'neutral', size, icon, children }: { device?: RtnDevice; tone?: RtnLabelTone; size?: 'small' | 'medium' | 'big'; icon?: IconName; children: ReactNode }) => {
  const s = size ?? (small(device) ? 'small' : 'big');
  return (
    <span className={cx('is-rtn-label', `is-rtn-label--${s}`, `is-rtn-label--${tone}`)}>
      {icon && <Icon name={icon} className="is-rtn-label__icon" />}
      <span>{children}</span>
    </span>
  );
};

/* ------------------------------------------------------------------ Container Content types (750:8315) */

/**
 * Container Content · Text. `previousNote` shows icon/previousnote/outline right before the text (hidden by default in
 * Figma): the entry was pulled from the previous note. 16px on iPhone, 20px on iPad / Web, 5px from the text.
 */
export const RtnText = ({ device = 'web', size, previousNote = false, children }: { device?: RtnDevice; size?: 'body' | 'large'; previousNote?: boolean; children: ReactNode }) => {
  const text = <p className={cx('is-rtn-text', `is-rtn-text--${size ?? 'body'}`, small(device) && 'is-rtn-text--iphone')}>{children}</p>;
  if (!previousNote) return text;
  return (
    <div className={cx('is-rtn-prev', small(device) && 'is-rtn-prev--iphone')}>
      <Icon name="previous-note" size={small(device) ? 16 : 20} className="is-rtn-prev__icon" title="From the previous note" />
      {text}
    </div>
  );
};

export interface RtnEditingProps {
  device?: RtnDevice;
  value: string;
  onChange?: (value: string) => void;
  onDiscard?: () => void;
  onSave?: (value: string) => void;
}

/** Container Content · Editing: the text box being edited, with Discard and Save. */
export const RtnEditing = ({ device = 'web', value, onChange, onDiscard, onSave }: RtnEditingProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  const size = small(device) ? 'regular' : 'big';
  return (
    <div className="is-rtn-editing">
      <div className="is-rtn-editing__box">
        <textarea
          ref={ref}
          className={cx('is-rtn-editing__input', small(device) ? 'is-rtn-text--iphone' : 'is-rtn-text--large')}
          value={value}
          rows={1}
          aria-label="Edit text"
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
      <div className="is-rtn-editing__actions">
        <Button variant="destructive-outline" size={size} onClick={onDiscard}>Discard</Button>
        <Button variant="primary" size={size} onClick={() => onSave?.(value)}>Save</Button>
      </div>
    </div>
  );
};

/** Container Content · Image: a picture (237 : 180, corners 12px) with its caption below. */
export const RtnImage = ({ src, alt = '', caption, onCaptionChange }: { src: string; alt?: string; caption?: string; onCaptionChange?: (c: string) => void }) => (
  <div className="is-rtn-image">
    <img className="is-rtn-image__img" src={src} alt={alt} />
    {onCaptionChange ? (
      <input className="is-rtn-image__caption" value={caption ?? ''} placeholder="Add caption" aria-label="Caption" onChange={(e) => onCaptionChange(e.target.value)} />
    ) : (
      <span className="is-rtn-image__caption">{caption || 'Add caption'}</span>
    )}
  </div>
);

export interface RtnDiagnosisProps {
  device?: RtnDevice;
  name: string;
  code: string;
  /** Active problem toggle */
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  /** Pulled from the previous note: the previous-note icon before the name */
  previousNote?: boolean;
}

/** Container Content · Diagnosis: name, ICD code label and the Active problem toggle. */
export const RtnDiagnosis = ({ device = 'web', name, code, active = false, onActiveChange, previousNote }: RtnDiagnosisProps) => (
  <div className="is-rtn-stack">
    <RtnText device={device} size="large" previousNote={previousNote}>{name}</RtnText>
    <RtnLabel device={device}>{code}</RtnLabel>
    <div className="is-rtn-active">
      <Toggle size={small(device) ? 'default' : 'xl'} checked={active} onChange={onActiveChange} label="Active problem" />
      <span className={cx('is-rtn-active__label', small(device) && 'is-rtn-active__label--iphone')}>Active problem</span>
    </div>
  </div>
);

/** Container Content · Order and Order + Label (a red alert code next to the name). */
export const RtnOrder = ({ device = 'web', name, alertCode, previousNote }: { device?: RtnDevice; name: string; alertCode?: string; previousNote?: boolean }) => (
  <div className="is-rtn-order">
    <RtnText device={device} size="large" previousNote={previousNote}>{name}</RtnText>
    {alertCode && <RtnLabel device={device} size={small(device) ? 'medium' : 'big'} tone="alert" icon="alert">{alertCode}</RtnLabel>}
  </div>
);

/* ------------------------------------------------------------------ Billing */

export interface BillingCodeProps {
  device?: RtnDevice;
  code: string;
  onRemove?: () => void;
  /** Drawn lifted (tilted 15° with a blur behind it) while being dragged */
  lifted?: boolean;
  /** Start dragging: called when the drag handle (the double kebab on the left) is pressed */
  onDragStart?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  /** Move one place earlier (-1) or later (+1), from the keyboard (arrow keys) */
  onMove?: (step: -1 | 1) => void;
  style?: CSSProperties;
  className?: string;
}

/**
 * Billing Code (Figma 797:4007): a secondary Button (Small on iPhone, Regular on iPad / Web) with the drag handle
 * (kebab 2 columns) on the left, the code in Relative Mono and × on the right. Hold the double kebab and drag to
 * reorder; from the keyboard, arrow keys move it and Delete removes it.
 */
export const BillingCode = ({ device = 'web', code, onRemove, lifted, onDragStart, onMove, style, className }: BillingCodeProps) => (
  <Button
    variant="secondary"
    size={small(device) ? 'small' : 'regular'}
    className={cx('is-billing-code', lifted && 'is-billing-code--lifted', className)}
    style={style}
    aria-label={`${code}. Arrow keys to move, Delete to remove`}
    onPointerDown={(e) => {
      if (!(e.target as HTMLElement).closest('.is-billing-code__handle')) return;
      onDragStart?.(e);
    }}
    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); onMove?.(-1); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); onMove?.(1); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); onRemove?.(); }
    }}
    iconLeft={
      <span className="is-billing-code__handle" title="Drag to reorder">
        <Icon name="kebab-2-columns" />
      </span>
    }
    iconRight={
      <span className="is-billing-code__remove" onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>
        <Icon name="close" />
      </span>
    }
  >
    {code}
  </Button>
);

export interface RtnBillingProps {
  device?: RtnDevice;
  /** E&M code, shown in the accent label */
  emCode: string;
  /** Diagnosis codes, in order. Hold a code's double kebab and drag it to reorder. */
  codes: string[];
  onCodesChange?: (codes: string[]) => void;
  onAddCode?: () => void;
  /** Static preview of the Figma "Filled in - Reordering" state: the index of the code being dragged */
  reorderingIndex?: number;
}

type Drag = {
  from: number;
  to: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** Where the code settles when released (the placeholder's position), while it animates back into the list */
  drop?: { left: number; top: number };
  /** data-theme of the nearest themed ancestor, so the floating code keeps its colors outside the card */
  theme?: string;
};

const DROP_MS = 180;

/**
 * Container Content · Billing: E&M code, the reorderable codes and "Add Code".
 * Holding a code's double kebab picks it up: it tilts 15°, grows slightly and casts a shadow, and floats above
 * everything on the page (rendered in a layer on top of the document) while it follows the pointer. The other codes
 * make room as it moves; on release it settles into its new slot.
 */
export const RtnBilling = ({ device = 'web', emCode, codes, onCodesChange, onAddCode, reorderingIndex }: RtnBillingProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const latest = useRef({ codes, onCodesChange });
  latest.current = { codes, onCodesChange };
  const dragging = drag !== null;

  const update = (d: Drag | null) => { dragRef.current = d; setDrag(d); };

  // Order shown while dragging: the dragged code's slot moves to the target index
  const order = codes.map((_, i) => i);
  if (drag && drag.from !== drag.to) {
    order.splice(drag.from, 1);
    order.splice(drag.to, 0, drag.from);
  }
  const preview = drag ? undefined : reorderingIndex;

  const start = (i: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || dragRef.current) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const theme = e.currentTarget.closest('[data-theme]')?.getAttribute('data-theme') ?? undefined;
    update({ from: i, to: i, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, theme });
  };

  useEffect(() => {
    if (!dragging) return;
    let timer: number | undefined;
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.drop) return;
      let to = d.to;
      const wrap = wrapRef.current;
      if (wrap) {
        let best = Infinity;
        wrap.querySelectorAll<HTMLElement>('[data-code-slot]').forEach((el) => {
          const r = el.getBoundingClientRect();
          const dist = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
          if (dist < best) { best = dist; to = Number(el.dataset.codeSlot); }
        });
      }
      update({ ...d, x: e.clientX, y: e.clientY, to });
    };
    const finish = () => {
      const d = dragRef.current;
      update(null);
      if (d && d.from !== d.to) {
        const next = [...latest.current.codes];
        const [c] = next.splice(d.from, 1);
        next.splice(d.to, 0, c);
        latest.current.onCodesChange?.(next);
      }
    };
    const up = () => {
      const d = dragRef.current;
      if (!d || d.drop) return;
      // Settle: glide into the placeholder, then commit the new order
      const slot = wrapRef.current?.querySelector<HTMLElement>('.is-billing-code-cell--held');
      const r = slot?.getBoundingClientRect();
      if (!r || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      update({ ...d, drop: { left: r.left, top: r.top } });
      timer = window.setTimeout(finish, DROP_MS);
    };
    const cursor = document.body.style.cursor;
    document.body.style.cursor = 'grabbing';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      document.body.style.cursor = cursor;
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragging]);

  const moveBy = (i: number) => (step: -1 | 1) => {
    const j = i + step;
    if (j < 0 || j >= codes.length) return;
    const next = [...codes];
    [next[i], next[j]] = [next[j], next[i]];
    onCodesChange?.(next);
  };

  // The held code, floating above the whole page
  const floating =
    drag && typeof document !== 'undefined'
      ? createPortal(
          <div className="is-billing-code-layer" data-theme={drag.theme}>
            <BillingCode
              device={device}
              code={codes[drag.from]}
              className={drag.drop ? 'is-billing-code--dropping' : 'is-billing-code--held'}
              style={{
                left: drag.drop ? drag.drop.left : drag.x - drag.dx,
                top: drag.drop ? drag.drop.top : drag.y - drag.dy,
                transformOrigin: `${drag.dx}px ${drag.dy}px`,
              }}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="is-rtn-stack">
      <RtnLabel device={device} size={small(device) ? 'medium' : 'big'} tone="accent">{emCode}</RtnLabel>
      <div className={cx('is-rtn-codes', dragging && 'is-rtn-codes--dragging')} ref={wrapRef}>
        {order.map((i, slot) => {
          const held = drag?.from === i;
          const lifted = preview === i;
          return (
            <span
              key={`${codes[i]}-${i}`}
              className={cx('is-billing-code-cell', (held || lifted) && 'is-billing-code-cell--empty', held && 'is-billing-code-cell--held')}
              data-code-slot={slot}
            >
              {held || lifted ? (
                <span className="is-billing-code-cell__sizer" aria-hidden="true" inert>
                  <BillingCode device={device} code={codes[i]} />
                </span>
              ) : null}
              {!held && (
                <BillingCode
                  device={device}
                  code={codes[i]}
                  lifted={lifted}
                  onRemove={() => onCodesChange?.(codes.filter((_, k) => k !== i))}
                  onDragStart={start(i)}
                  onMove={moveBy(i)}
                />
              )}
            </span>
          );
        })}
        <Button variant="primary" size={small(device) ? 'small' : 'regular'} iconLeft={<Icon name="add" />} onClick={onAddCode}>
          Add Code
        </Button>
      </div>
      {floating}
    </div>
  );
};

/* ------------------------------------------------------------------ The card */

export interface RtnItemProps {
  device?: RtnDevice;
  topic: RtnTopic;
  title?: string;
  /** Number in the header; defaults to the number of entries */
  count?: number | string;
  onAdd?: () => void;
  /** Filling in: the spinner replaces the + */
  loading?: boolean;
  /** The entries (RtnItemContent boxes). Leave empty for the Figma "empty" state. */
  children?: ReactNode;
  className?: string;
}

/** RTN Items (Today), 738:5831: one topic card of the note. */
export const RtnItem = ({ device = 'web', topic, title, count, onAdd, loading, children, className }: RtnItemProps) => {
  const entries = Children.toArray(children);
  return (
    <section className={cx('is-rtn-item', `is-rtn-item--${device}`, entries.length === 0 && 'is-rtn-item--empty', className)}>
      <RtnItemHeader device={device} topic={topic} title={title} count={count ?? entries.length} onAdd={onAdd} loading={loading} />
      {children}
    </section>
  );
};

/* ------------------------------------------------------------------ Main frame */

export const rtnTabs: TabsOption[] = [
  { value: 'chart-prep', label: 'Chart Prep' },
  { value: 'previous-note', label: 'Previous Note' },
  { value: 'current-note', label: 'Current Note' },
];

export interface RtnMainFrameProps {
  device?: RtnDevice;
  /** Selected tab (Chart Prep · Previous Note · Current Note) */
  tab?: string;
  onTabChange?: (tab: string) => void;
  /** Sections pulled forward from the previous note: shows the Previous Note Summary above the list (leave it out to hide it) */
  pulledForward?: { title: string; icon: IconName }[];
  /** Autosaved ✓ under the list (iPad / Web) */
  autosaved?: boolean;
  /** The RTN item cards */
  children: ReactNode;
  className?: string;
}

/**
 * RTN Main Frame (Today), 771:1570. iPhone: a bottom sheet (dragger, tabs, cards 10px apart). iPad / Web: a 30px
 * rounded panel with the tabs on top and the note below on a soft background (cards 20px apart, Autosaved at the bottom).
 */
export const RtnMainFrame = ({ device = 'web', tab, onTabChange, pulledForward, autosaved = true, children, className }: RtnMainFrameProps) => {
  const tabs = <Tabs device={device} options={rtnTabs} value={tab} defaultValue="current-note" onChange={onTabChange} aria-label="Note" />;
  const summary = pulledForward && pulledForward.length > 0 && <PreviousNoteSummary device={device} sections={pulledForward} />;
  if (small(device)) {
    return (
      <div className={cx('is-rtn-frame', 'is-rtn-frame--iphone', className)}>
        <div className="is-rtn-frame__dragger" aria-hidden="true" />
        {tabs}
        {summary}
        <div className="is-rtn-frame__list">{children}</div>
      </div>
    );
  }
  return (
    <div className={cx('is-rtn-frame', `is-rtn-frame--${device}`, className)}>
      <div className="is-rtn-frame__tabs">{tabs}</div>
      <div className="is-rtn-frame__note">
        {summary}
        <div className="is-rtn-frame__list">{children}</div>
        {autosaved && (
          <div className="is-rtn-frame__bottom">
            <span className="is-rtn-frame__autosaved">Autosaved <Icon name="check" size={12} /></span>
          </div>
        )}
      </div>
    </div>
  );
};
