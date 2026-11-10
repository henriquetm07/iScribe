import { useState } from 'react';
import { Icon } from '../icons/Icon';
import { iconNames, type IconName } from '../icons/icons';
import './IconGallery.css';

const sizes = [12, 16, 24, 32] as const;

/** Searchable grid of every icon. Click a tile to copy its JSX. */
export const IconGallery = () => {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<(typeof sizes)[number]>(24);
  const [copied, setCopied] = useState<IconName | null>(null);
  const shown = iconNames.filter((n) => n.includes(query.trim().toLowerCase().replace(/\s+/g, '-')));

  const copy = (name: IconName) => {
    const text = `<Icon name="${name}" size={${size}} />`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(name);
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div className="is-icon-gallery">
      <div className="is-icon-gallery__bar">
        <input
          className="is-icon-gallery__search"
          type="search"
          placeholder={`Search ${iconNames.length} icons…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search icons"
        />
        <div className="is-icon-gallery__sizes" role="group" aria-label="Preview size">
          {sizes.map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}px
            </button>
          ))}
        </div>
      </div>
      <div className="is-icon-gallery__grid">
        {shown.map((name) => (
          <button
            key={name}
            type="button"
            className="is-icon-tile"
            onClick={() => copy(name)}
            title={`Copy <Icon name="${name}" />`}
            data-icon={name}
          >
            <span className="is-icon-tile__art">
              <Icon name={name} size={size} />
            </span>
            <span className="is-icon-tile__name">{copied === name ? 'Copied!' : name}</span>
          </button>
        ))}
        {shown.length === 0 && <p className="is-icon-gallery__empty">No icon matches “{query}”.</p>}
      </div>
    </div>
  );
};
