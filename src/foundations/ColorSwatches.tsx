import { useState } from 'react';
import { colorGroups, type ColorGroup, type ColorToken } from '../styles/colors';
import './ColorSwatches.css';

const checker =
  'repeating-conic-gradient(#d9dce0 0% 25%, #ffffff 0% 50%) 50% / 16px 16px';

const Swatch = ({ color }: { color: ColorToken }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`var(${color.token})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <button type="button" className="is-swatch" onClick={copy} title={`Copy var(${color.token})`}>
      <span className="is-swatch__chip" style={{ background: checker }}>
        <span className="is-swatch__fill" style={{ background: color.value }} />
      </span>
      <span className="is-swatch__meta">
        <span className="is-swatch__name">{color.name}</span>
        <span className="is-swatch__value">{color.label}</span>
        <code className="is-swatch__token">{copied ? 'Copied!' : color.token}</code>
      </span>
    </button>
  );
};

const Group = ({ group }: { group: ColorGroup }) => (
  <section className="is-swatch-group">
    <h3 className="is-swatch-group__title">{group.group}</h3>
    <div className="is-swatch-group__grid">
      {group.colors.map((c) => (
        <Swatch key={c.token} color={c} />
      ))}
    </div>
  </section>
);

/** Renders every color group in one section (Neutrals, Periwinkles or Status). */
export const ColorSection = ({ section }: { section: ColorGroup['section'] }) => (
  <div className="is-swatch-section">
    {colorGroups
      .filter((g) => g.section === section)
      .map((g) => (
        <Group key={g.group} group={g} />
      ))}
  </div>
);
