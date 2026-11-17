import { Children, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { Button } from '../Button/Button';
import { Tabs, type TabsOption } from '../Tabs/Tabs';
import { Toggle } from '../Toggle/Toggle';
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
}

/** RTN Item Header (Today), 738:6485: topic icon, title, counter and the + button. */
export const RtnItemHeader = ({ device = 'web', topic, title, count = 0, onAdd }: RtnItemHeaderProps) => {
  const t = topicOf(topic);
  const iconSize = small(device) ? 16 : 20;
  return (
    <div className={cx('is-rtn-header', `is-rtn-header--${device}`)}>
      <div className="is-rtn-header__label">
        <Icon name={t.icon} size={iconSize} className="is-rtn-header__icon" />
        <span className="is-rtn-header__title">{title ?? t.label}</span>
        <RtnCounter device={device} count={count} />
      </div>
      <button type="button" className="is-rtn-icon-action is-rtn-header__add" aria-label={`Add to ${title ?? t.label}`} onClick={onAdd}>
        <Icon name="add" size={small(device) ? 16 : 18} />
      </button>
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

export type RtnLabelTone = 'neutral' | 'accent' | 'alert';

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

/** Container Content · Text */
export const RtnText = ({ device = 'web', size, children }: { device?: RtnDevice; size?: 'body' | 'large'; children: ReactNode }) => (
  <p className={cx('is-rtn-text', `is-rtn-text--${size ?? 'body'}`, small(device) && 'is-rtn-text--iphone')}>{children}</p>
);

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
}

/** Container Content · Diagnosis: name, ICD code label and the Active problem toggle. */
export const RtnDiagnosis = ({ device = 'web', name, code, active = false, onActiveChange }: RtnDiagnosisProps) => (
  <div className="is-rtn-stack">
    <RtnText device={device} size="large">{name}</RtnText>
    <RtnLabel device={device}>{code}</RtnLabel>
    <div className="is-rtn-active">
      <Toggle size={small(device) ? 'default' : 'xl'} checked={active} onChange={onActiveChange} label="Active problem" />
      <span className={cx('is-rtn-active__label', small(device) && 'is-rtn-active__label--iphone')}>Active problem</span>
    </div>
  </div>
);

/** Container Content · Order and Order + Label (a red alert code next to the name). */
export const RtnOrder = ({ device = 'web', name, alertCode }: { device?: RtnDevice; name: string; alertCode?: string }) => (
  <div className="is-rtn-order">
    <RtnText device={device} size="large">{name}</RtnText>
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
}

/**
 * Billing Code (Figma 797:4007): a secondary Button (Small on iPhone, Regular on iPad / Web) with the drag handle
 * (kebab 2 columns) on the left, the code in Relative Mono and × on the right. Hold the double kebab and drag to
 * reorder; from the keyboard, arrow keys move it and Delete removes it.
 */
export const BillingCode = ({ device = 'web', code, onRemove, lifted, onDragStart, onMove, style }: BillingCodeProps) => (
  <Button
    variant="secondary"
    size={small(device) ? 'small' : 'regular'}
    className={cx('is-billing-code', lifted && 'is-billing-code--lifted')}
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

type Drag = { from: number; to: number; x: number; y: number; dx: number; dy: number };

/** Container Content · Billing: E&M code, the reorderable codes and "Add Code". */
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
    if (e.button !== 0) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    update({ from: i, to: i, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top });
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
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
    const up = () => {
      const d = dragRef.current;
      update(null);
      if (d && d.from !== d.to) {
        const next = [...latest.current.codes];
        const [c] = next.splice(d.from, 1);
        next.splice(d.to, 0, c);
        latest.current.onCodesChange?.(next);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
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

  return (
    <div className="is-rtn-stack">
      <RtnLabel device={device} size={small(device) ? 'medium' : 'big'} tone="accent">{emCode}</RtnLabel>
      <div className={cx('is-rtn-codes', dragging && 'is-rtn-codes--dragging')} ref={wrapRef}>
        {order.map((i, slot) => {
          const isDragged = drag?.from === i;
          const lifted = isDragged || preview === i;
          const chip = (
            <BillingCode
              device={device}
              code={codes[i]}
              lifted={lifted}
              onRemove={() => onCodesChange?.(codes.filter((_, k) => k !== i))}
              onDragStart={start(i)}
              onMove={moveBy(i)}
              style={isDragged && drag ? { position: 'fixed', left: drag.x - drag.dx, top: drag.y - drag.dy, zIndex: 1000 } : undefined}
            />
          );
          return (
            <span
              key={`${codes[i]}-${i}`}
              className={cx('is-billing-code-cell', lifted && 'is-billing-code-cell--empty')}
              data-code-slot={slot}
            >
              {lifted && (
                <span className="is-billing-code-cell__sizer" aria-hidden="true" inert>
                  <BillingCode device={device} code={codes[i]} />
                </span>
              )}
              {chip}
            </span>
          );
        })}
        <Button variant="primary" size={small(device) ? 'small' : 'regular'} iconLeft={<Icon name="add" />} onClick={onAddCode}>
          Add Code
        </Button>
      </div>
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
  /** The entries (RtnItemContent boxes). Leave empty for the Figma "empty" state. */
  children?: ReactNode;
  className?: string;
}

/** RTN Items (Today), 738:5831: one topic card of the note. */
export const RtnItem = ({ device = 'web', topic, title, count, onAdd, children, className }: RtnItemProps) => {
  const entries = Children.toArray(children);
  return (
    <section className={cx('is-rtn-item', `is-rtn-item--${device}`, entries.length === 0 && 'is-rtn-item--empty', className)}>
      <RtnItemHeader device={device} topic={topic} title={title} count={count ?? entries.length} onAdd={onAdd} />
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
  /** "N sections pulled forward" line above the list; leave it out to hide it */
  pulledForward?: number;
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
  const summary = pulledForward != null && (
    <div className={cx('is-rtn-summary', small(device) && 'is-rtn-summary--iphone')}>
      <span className="is-rtn-summary__icons">
        {(['history', 'system', 'exam'] as IconName[]).map((n) => (
          <span key={n} className="is-rtn-summary__icon"><Icon name={n} size={small(device) ? 16 : 20} /></span>
        ))}
      </span>
      <span className="is-rtn-summary__text">{pulledForward} sections pulled forward</span>
    </div>
  );
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
