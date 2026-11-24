import type { ReactNode } from 'react';
import { AnimatedIcon } from '../../icons/AnimatedIcon';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import './ConnectivityDialog.css';

/*
 * Connectivity Dialog — Figma "Connectivity Dialog" (3483:17589): a check of every host the app needs, grouped
 * (iScribe Backend, Authentication, …), each with its status and response time, and Reprocess to check again.
 */

/** checking = spinner, "-" · ok = green check flat and the time in ms · error = red alert flat and the reason in red */
export type ConnectivityStatus = 'checking' | 'ok' | 'error';

export interface ConnectivityHost {
  host: string;
  status: ConnectivityStatus;
  /** Response time, for ok */
  ms?: number;
  /** Why it failed, for error (default "Unreachable (blocked, DNS or TLS)") */
  error?: string;
}

export interface ConnectivityGroup {
  title: string;
  hosts: ConnectivityHost[];
}

export interface ConnectivityDialogProps {
  groups: ConnectivityGroup[];
  /** Title in the header (default "Connectivity") */
  title?: ReactNode;
  /** The note in the footer, next to Reprocess */
  note?: ReactNode;
  /** Reprocess: check every host again */
  onReprocess?: () => void;
  /** Reprocess is pressed while a check runs */
  checking?: boolean;
  className?: string;
}

export const CONNECTIVITY_UNREACHABLE = 'Unreachable (blocked, DNS or TLS)';

/** One row (Figma "List"): status icon, host (Relative Mono 12, cut with … when long) and the result on the right */
export const ConnectivityRow = ({ host, status, ms, error }: ConnectivityHost) => (
  <div className={`is-connectivity__row is-connectivity__row--${status}`}>
    <span className="is-connectivity__status">
      {status === 'checking' ? (
        <AnimatedIcon name="spinner" size={12} title="Checking" fallback={<Icon name="spinner" size={12} />} />
      ) : (
        <Icon name={status === 'ok' ? 'check-flat' : 'alert-flat'} size={12} title={status === 'ok' ? 'Reachable' : 'Unreachable'} />
      )}
      <span className="is-connectivity__host" title={host}>
        {host}
      </span>
    </span>
    <span className="is-connectivity__result">{status === 'checking' ? '-' : status === 'ok' ? `${ms ?? 0} ms` : (error ?? CONNECTIVITY_UNREACHABLE)}</span>
  </div>
);

/**
 * Connectivity Dialog: 600px wide, corners 20px, elevated background with a 1px soft-contrast edge. Header (icon/
 * connectivity 16px + "Connectivity", Figtree SemiBold 14px, 9px apart), then each group's title (Figtree SemiBold 12px)
 * and its rows 5px apart with a 1px soft-contrast separator between them; 20px padding, 12px gap. Footer (1px top
 * edge, padding 20, gap 12): the note (Figtree 12px) and Reprocess (Button Secondary Regular, icon/reload).
 */
export const ConnectivityDialog = ({
  groups,
  title = 'Connectivity',
  note = 'Port 443 only • browser extensions (ad blockers) can block analytics',
  onReprocess,
  checking = false,
  className = '',
}: ConnectivityDialogProps) => (
  <section className={`is-connectivity ${className}`.trim()} aria-label={typeof title === 'string' ? title : 'Connectivity'}>
    <div className="is-connectivity__board">
      <header className="is-connectivity__header">
        <Icon name="connectivity" size={16} />
        <h2 className="is-connectivity__title">{title}</h2>
      </header>
      {groups.map((g) => (
        <div key={g.title} className="is-connectivity__group">
          <h3 className="is-connectivity__group-title">{g.title}</h3>
          <div className="is-connectivity__list" role="list">
            {g.hosts.map((h, i) => (
              <div key={h.host} role="listitem" className="is-connectivity__item">
                {i > 0 && <hr className="is-connectivity__separator" />}
                <ConnectivityRow {...h} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <footer className="is-connectivity__footer">
      <p className="is-connectivity__note">{note}</p>
      <Button variant="secondary" size="regular" iconLeft={<Icon name="reload" />} onClick={onReprocess} disabled={checking}>
        Reprocess
      </Button>
    </footer>
  </section>
);
