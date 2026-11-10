import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Blueprint } from './Blueprint';

/*
 * On Docs pages, Storybook puts a small toolbar above the main preview (Reload story, Zoom in, Zoom out,
 * Reset zoom). Storybook has no API to add buttons there, so this finds that toolbar from inside the story
 * and places a "Blueprint" button in it, styled like its neighbours. It toggles the blueprint for that
 * preview only. The Blueprint button in the top bar still turns it on for every story.
 */
const BlueprintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" />
    <path d="M1.5 5h11M5 1.5v11M7.5 8h3M7.5 10h2" />
  </svg>
);

export const DocsBlueprint = ({ children, title, forced }: { children: ReactNode; title: string; forced: boolean }) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [buttonClass, setButtonClass] = useState('');
  const [on, setOn] = useState(false);

  useEffect(() => {
    const find = () => {
      const preview = anchor.current?.closest('.sbdocs-preview');
      const neighbour = preview?.querySelector<HTMLButtonElement>('button[aria-label="Reset zoom"], button[aria-label="Zoom in"]');
      const bar = neighbour?.parentElement;
      if (!bar || !neighbour) return false;
      let s = bar.querySelector<HTMLElement>(':scope > .bp-docs-slot');
      if (!s) {
        s = document.createElement('span');
        s.className = 'bp-docs-slot';
        s.style.display = 'contents';
        bar.appendChild(s);
      }
      setSlot(s);
      setButtonClass(neighbour.className);
      return true;
    };
    if (find()) return;
    // The toolbar can render a moment after the story
    const timers = [200, 600, 1500].map((ms) => window.setTimeout(find, ms));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const active = on || forced;
  return (
    <>
      <span ref={anchor} hidden />
      {active ? <Blueprint title={title}>{children}</Blueprint> : children}
      {slot &&
        createPortal(
          <button
            type="button"
            className={buttonClass}
            aria-pressed={active}
            title={active ? 'Hide blueprint' : 'Show blueprint: structure, spacing, specs and nested components'}
            onClick={() => setOn((v) => !v)}
            disabled={forced}
            style={{
              width: 'auto',
              gap: 6,
              padding: '0 8px',
              fontFamily: "'Figtree', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: active ? '#029CFD' : undefined,
              background: active ? 'rgba(2, 156, 253, 0.12)' : undefined,
            }}
          >
            <BlueprintIcon />
            Blueprint
          </button>,
          slot,
        )}
    </>
  );
};
