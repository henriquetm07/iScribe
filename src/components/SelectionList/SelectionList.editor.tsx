/**
 * Story-only helper: an editor shown next to the Selection List preview, to type, add, remove and
 * reorder its rows. Built from iScribe's own Button, Icon Button and Icons. Not part of the library.
 */
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon } from '../../icons/Icon';
import type { SelectionListOption } from './SelectionList';
import './SelectionList.editor.css';

let counter = 0;
const newValue = () => `row-${Date.now().toString(36)}-${counter++}`;

export const OptionsEditor = ({
  options,
  onChange,
}: {
  options: SelectionListOption[];
  onChange: (next: SelectionListOption[]) => void;
}) => {
  const update = (i: number, patch: Partial<SelectionListOption>) => onChange(options.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const remove = (i: number) => onChange(options.filter((_, j) => j !== i));
  const move = (i: number, by: -1 | 1) => {
    const j = i + by;
    if (j < 0 || j >= options.length) return;
    const next = [...options];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...options, { value: newValue(), label: `New row ${options.length + 1}` }]);

  return (
    <section className="is-sl-editor" aria-label="Edit rows">
      <header className="is-sl-editor__head">
        <span>Rows</span>
        <span className="is-sl-editor__count">{options.length}</span>
      </header>
      <ol className="is-sl-editor__rows">
        {options.map((o, i) => (
          <li key={o.value} className="is-sl-editor__row">
            <span className="is-sl-editor__num">{i + 1}</span>
            <input
              className={`is-sl-editor__input${o.destructive ? ' is-sl-editor__input--destructive' : ''}`}
              value={o.label}
              aria-label={`Row ${i + 1} label`}
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
            <IconButton icon={<Icon name="chevron-up" />} label={`Move row ${i + 1} up`} variant="ghost" size="mini" disabled={i === 0} onClick={() => move(i, -1)} />
            <IconButton
              icon={<Icon name="chevron-down" />}
              label={`Move row ${i + 1} down`}
              variant="ghost"
              size="mini"
              disabled={i === options.length - 1}
              onClick={() => move(i, 1)}
            />
            <IconButton icon={<Icon name="trash" />} label={`Remove row ${i + 1}`} variant="ghost" size="mini" onClick={() => remove(i)} />
          </li>
        ))}
      </ol>
      <Button variant="secondary" size="small" rounded iconLeft={<Icon name="add" />} onClick={add}>
        Add row
      </Button>
      <p className="is-sl-editor__hint">Press Enter in a row to add another. The alert toggle makes a row destructive.</p>
    </section>
  );
};
