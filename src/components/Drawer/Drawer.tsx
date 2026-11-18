import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { DrawerHeader, type DrawerDevice, type DrawerHeaderProps } from './DrawerHeader';
import './Drawer.css';

/*
 * Components / Drawer / Drawer — Figma "Drawer List Modal" (731:5793).
 * A modal panel over the page (Modal BG): the Drawer Header on top and a main area below it with the content.
 * iPhone: a sheet that slides up from the bottom (top corners 30px). iPad and Web: a panel up to 500px wide that
 * slides in from the right, full height. Closes with ×, a tap on the dimmed page or Escape.
 */

/** How long the drawer takes to slide in or out, in ms (matches Drawer.css) */
export const DRAWER_MS = 320;

type HeaderProps = Pick<
  DrawerHeaderProps,
  | 'icon'
  | 'title'
  | 'description'
  | 'count'
  | 'search'
  | 'searchPlaceholder'
  | 'searchValue'
  | 'onSearchChange'
  | 'filter'
  | 'onFilter'
  | 'filterCount'
  | 'closeButton'
>;

export interface DrawerProps extends HeaderProps {
  device?: DrawerDevice;
  /** Shown or hidden. It slides in and out. */
  open?: boolean;
  /** Called by ×, a tap on the dimmed page or Escape */
  onClose?: () => void;
  /** The main area, under the header (scrolls when it is taller than the drawer) */
  children?: ReactNode;
  /**
   * Cover the nearest positioned parent instead of the whole window — for previews, where the drawer opens inside
   * a device frame.
   */
  contained?: boolean;
  className?: string;
}

type Phase = 'closed' | 'entering' | 'open' | 'leaving';

/** Figma "Drawer List Modal": the dimmed page and the drawer (Drawer Header + main area) */
export const Drawer = ({
  device = 'iphone',
  open = false,
  onClose,
  children,
  contained = false,
  className = '',
  description = '',
  closeButton = true,
  ...header
}: DrawerProps) => {
  // Always starts closed, so it slides in even when it mounts already open
  const [phase, setPhase] = useState<Phase>('closed');
  const panelRef = useRef<HTMLDivElement>(null);

  // Slide in: mount off-screen ("entering"), then move in. Slide out: move off-screen, then unmount.
  useEffect(() => {
    if (open) {
      setPhase((p) => (p === 'open' || p === 'entering' ? p : 'entering'));
      return;
    }
    setPhase((p) => (p === 'closed' ? p : 'leaving'));
  }, [open]);

  useLayoutEffect(() => {
    if (phase === 'entering') {
      // Make the browser lay out the off-screen position first, then move in on the next frame
      panelRef.current?.getBoundingClientRect();
      const frame = requestAnimationFrame(() => setPhase((p) => (p === 'entering' ? 'open' : p)));
      return () => cancelAnimationFrame(frame);
    }
    if (phase === 'leaving') {
      const t = setTimeout(() => setPhase((p) => (p === 'leaving' ? 'closed' : p)), DRAWER_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Escape closes; focus moves into the drawer when it opens
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current?.();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (phase === 'closed') return null;

  return (
    <div
      className={[
        'is-drawer',
        `is-drawer--${device}`,
        `is-drawer--${phase === 'open' ? 'open' : 'closed'}`,
        contained && 'is-drawer--contained',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="is-drawer__backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        className="is-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label={header.title ?? 'Add Macros'}
        tabIndex={-1}
      >
        <DrawerHeader
          device={device}
          width="100%"
          description={description}
          closeButton={closeButton}
          onClose={onClose}
          className="is-drawer__header"
          {...header}
        />
        <div className="is-drawer__body">{children}</div>
      </div>
    </div>
  );
};
