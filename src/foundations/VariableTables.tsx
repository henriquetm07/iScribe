import { useState } from 'react';
import { variableCollections, type DesignVariable, type VariableCollection } from '../styles/variables';
import './VariableTables.css';

const checker = 'repeating-conic-gradient(#d9dce0 0% 25%, #ffffff 0% 50%) 50% / 10px 10px';

const CopyCode = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="is-vars__code"
      title={`Copy var(${value})`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`var(${value})`);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied!' : value}
    </button>
  );
};

const Cell = ({ variable, mode, showVar }: { variable: DesignVariable; mode: string; showVar: boolean }) => {
  const v = variable.values[mode];
  if (!v) return <td />;
  return (
    <td>
      <div className="is-vars__value">
        {variable.type === 'color' && v.resolved && (
          <span className="is-vars__chip" style={{ background: checker }}>
            <span style={{ background: v.resolved }} />
          </span>
        )}
        <span className="is-vars__label">
          <span>{v.label}</span>
          {variable.type === 'color' && v.resolved && v.label !== v.resolved && (
            <span className="is-vars__resolved">{v.resolved}</span>
          )}
          {showVar && v.cssVar && <CopyCode value={v.cssVar} />}
        </span>
      </div>
    </td>
  );
};

const Table = ({ collection }: { collection: VariableCollection }) => {
  // Collections whose modes are sizes get one CSS variable per mode; show it inside each cell.
  const perModeVars = collection.vars.some((v) => Object.values(v.values).some((x) => x.cssVar));
  return (
    <div className="is-vars__scroll">
      <table className="is-vars">
        <thead>
          <tr>
            <th>Figma variable</th>
            {!perModeVars && <th>CSS variable</th>}
            {collection.modes.map((m) => (
              <th key={m}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collection.vars.map((v) => (
            <tr key={v.name}>
              <td className="is-vars__name">{v.name}</td>
              {!perModeVars && <td>{v.cssVar && <CopyCode value={v.cssVar} />}</td>}
              {collection.modes.map((m) => (
                <Cell key={m} variable={v} mode={m} showVar={perModeVars} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Renders the variables of one Figma collection as a table. */
export const VariableTable = ({ collection }: { collection: string }) => {
  const c = variableCollections.find((x) => x.name === collection);
  return c ? <Table collection={c} /> : <p>No collection named “{collection}”.</p>;
};

/** Semantic colors grouped by their first path segment (Button, Surface, Foreground…). */
export const SemanticColorTables = () => {
  const c = variableCollections.find((x) => x.name === 'Semantic Colors');
  if (!c) return null;
  const groups = new Map<string, DesignVariable[]>();
  c.vars.forEach((v) => {
    const g = v.name.split('/')[0];
    groups.set(g, [...(groups.get(g) ?? []), v]);
  });
  return (
    <>
      {[...groups.entries()].map(([group, vars]) => (
        <div key={group} className="is-vars__group">
          <h3 className="is-vars__group-title">{group}</h3>
          <Table collection={{ ...c, vars }} />
        </div>
      ))}
    </>
  );
};
