/**
 * Story-only helper: an editor shown next to the Selection List preview, to type, add, remove and
 * reorder its rows. Built from iScribe's own Button, Icon Button and Icons. Not part of the library.
 */
import { useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon } from '../../icons/Icon';
import { iconNames, type IconName } from '../../icons/icons';
import type { SelectionListOption } from './SelectionList';
import './SelectionList.editor.css';

let counter = 0;
const newValue = () => `row-${Date.now().toString(36)}-${counter++}`;

const moveItem = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const OptionsEditor = ({
  options,
  onChange,
}: {
  options: SelectionListOption[];
  onChange: (next: SelectionListOption[]) => void;
}) => {
  const listRef = useRef<HTMLOListElement>(null);
  /** While dragging: which row is held and where it would land */
  const [drag, setDragState] = useState<{ from: number; to: number } | null>(null);
  // Mirrored in a ref so a fast flick (move/up before React re-renders) still lands
  const dragRef = useRef(drag);
  const setDrag = (d: typeof drag) => {
    dragRef.current = d;
    setDragState(d);
  };
  const mids = useRef<number[]>([]);

  const update = (i: number, patch: Partial<SelectionListOption>) => onChange(options.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const remove = (i: number) => onChange(options.filter((_, j) => j !== i));
  const add = () => onChange([...options, { value: newValue(), label: `New row ${options.length + 1}` }]);

  const startDrag = (i: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    // Row centres as they are before the drag; the drop position is worked out against these
    mids.current = [...(listRef.current?.children ?? [])].map((li) => {
      const r = li.getBoundingClientRect();
      return r.top + r.height / 2;
    });
    setDrag({ from: i, to: i });
  };
  const onDragMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const to = Math.max(0, Math.min(options.length - 1, mids.current.filter((m) => e.clientY > m).length - (e.clientY > mids.current[d.from] ? 1 : 0)));
    if (to !== d.to) setDrag({ ...d, to });
  };
  const endDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    onDragMove(e);
    const d = dragRef.current;
    if (d && d.from !== d.to) onChange(moveItem(options, d.from, d.to));
    setDrag(null);
  };
  /** Keyboard: focus the handle and use the arrow keys */
  const onHandleKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = e.key === 'ArrowUp' ? i - 1 : e.key === 'ArrowDown' ? i + 1 : -1;
    if (to < 0 || to >= options.length) return;
    e.preventDefault();
    onChange(moveItem(options, i, to));
    requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLButtonElement>('.is-sl-editor__handle')[to]?.focus());
  };

  // While dragging, show the rows in the order they would drop in
  const shown = drag ? moveItem(options.map((o, i) => ({ o, i })), drag.from, drag.to) : options.map((o, i) => ({ o, i }));

  return (
    <section className="is-sl-editor" aria-label="Edit rows">
      <header className="is-sl-editor__head">
        <span>Rows</span>
        <span className="is-sl-editor__count">{options.length}</span>
      </header>
      <ol ref={listRef} className={`is-sl-editor__rows${drag ? ' is-sl-editor__rows--dragging' : ''}`}>
        {shown.map(({ o, i }, pos) => (
          <li key={o.value} className={`is-sl-editor__row${drag?.from === i ? ' is-sl-editor__row--held' : ''}`}>
            <button
              type="button"
              className="is-sl-editor__handle"
              aria-label={`Reorder row ${pos + 1}. Drag, or use the up and down arrow keys`}
              title="Drag to reorder"
              onPointerDown={startDrag(i)}
              onPointerMove={onDragMove}
              onPointerUp={endDrag}
              onPointerCancel={() => setDrag(null)}
              onKeyDown={onHandleKey(i)}
            >
              {/* Grip: two kebab icons side by side (a double-column kebab) */}
              <span className="is-sl-editor__grip" aria-hidden>
                <Icon name="kebab" size={12} />
                <Icon name="kebab" size={12} />
              </span>
            </button>
            <span className="is-sl-editor__num">{pos + 1}</span>
            <input
              className={`is-sl-editor__input${o.destructive ? ' is-sl-editor__input--destructive' : ''}`}
              value={o.label}
              aria-label={`Row ${pos + 1} label`}
              placeholder="Row label"
              onChange={(e) => update(i, { label: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add();
              }}
            />
            <label className="is-sl-editor__toggle" title="Destructive (red text)">
              <input type="checkbox" checked={!!o.destructive} onChange={(e) => update(i, { destructive: e.target.checked })} />
              <Icon name="alert" size={12} />
            </label>
            <IconButton icon={<Icon name="trash" />} label={`Remove row ${pos + 1}`} variant="ghost" size="mini" onClick={() => remove(i)} />
            {/* Icons, as in Selection List Item: optional left and right (the selected row shows the check on the right) */}
            <div className="is-sl-editor__icons">
              {(['iconLeft', 'iconRight'] as const).map((side) => {
                const current = side === 'iconLeft' ? (o.iconLeft ?? o.icon) : o.iconRight;
                return (
                  <label key={side} className="is-sl-editor__icon-pick">
                    <span>{side === 'iconLeft' ? 'Left' : 'Right'}</span>
                    <span className="is-sl-editor__icon-preview" aria-hidden>
                      {current && <Icon name={current} size={12} />}
                    </span>
                    <select
                      value={current ?? ''}
                      aria-label={`Row ${pos + 1} ${side === 'iconLeft' ? 'left' : 'right'} icon`}
                      onChange={(e) => {
                        const name = (e.target.value || undefined) as IconName | undefined;
                        update(i, side === 'iconLeft' ? { iconLeft: name, icon: undefined } : { iconRight: name });
                      }}
                    >
                      <option value="">None</option>
                      {iconNames.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <Button variant="secondary" size="small" rounded iconLeft={<Icon name="add" />} onClick={add}>
        Add row
      </Button>
      <p className="is-sl-editor__hint">Drag the handle to reorder. Press Enter in a row to add another. The alert toggle makes a row destructive. Left and Right pick each row's icons.</p>
    </section>
  );
};
