import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { RtnLabel } from '../RTNItems/RTNItems';
import type { DrawerDevice } from './DrawerHeader';
import '../RTNItems/RTNItems.css';
import './Drawer.css';

/*
 * The content of the Drawer's main area in Figma "Drawer List Modal": the list (a title per group, e.g.
 * "Added Macros" / "All Macros" / "Search Results"), the Drawer Macro List Item and the "No results" message.
 * Web uses the compact (iPhone) sizes, like its Drawer Header.
 */

/** Figma "List items": the column of titles and items, 20px padding, 10px apart */
export const DrawerList = ({ children }: { children: ReactNode }) => <div className="is-drawer-list">{children}</div>;

/** A group title in the list, e.g. "Added Macros" (Figtree Medium 15px · 17px on iPad) */
export const DrawerListTitle = ({ device = 'iphone', children }: { device?: DrawerDevice; children: ReactNode }) => (
  <p className={`is-drawer-list__title is-drawer-list__title--${device}`}>{children}</p>
);

export interface DrawerMacroListItemProps {
  device?: DrawerDevice;
  /** The macro's name */
  name: string;
  /** Section label, e.g. "PE", "ROS", "Procedures" */
  section?: string;
  /** Where it comes from, e.g. "Athena" */
  source?: string;
  /** Added: dark, with × to remove it. Otherwise outlined, with + to add it. */
  added?: boolean;
  /** Called with the tap: adds it, or removes it when added */
  onToggle?: () => void;
}

/** Figma "Drawer Macro List Item": Default (outlined, +) or Added (dark, ×) */
export const DrawerMacroListItem = ({ device = 'iphone', name, section, source, added = false, onToggle }: DrawerMacroListItemProps) => {
  const big = device === 'ipad';
  return (
    <button
      type="button"
      className={['is-drawer-item', `is-drawer-item--${device}`, added && 'is-drawer-item--added'].filter(Boolean).join(' ')}
      aria-pressed={added}
      aria-label={`${added ? 'Remove' : 'Add'} ${name}`}
      onClick={onToggle}
    >
      <span className="is-drawer-item__text">
        <span className="is-drawer-item__name">{name}</span>
        {!added && (section || source) && (
          <span className="is-drawer-item__meta">
            {section && (
              <RtnLabel device={big ? 'ipad' : 'iphone'} size={big ? 'big' : 'small'}>
                {section}
              </RtnLabel>
            )}
            {source && <span className="is-drawer-item__source">{source}</span>}
          </span>
        )}
      </span>
      <span className="is-drawer-item__action" aria-hidden="true">
        <Icon name={added ? 'close' : 'add'} size={big ? 20 : 16} />
      </span>
    </button>
  );
};

/** Figma "No results": the magnifier with × and the message, centred */
export const DrawerNoResults = ({ device = 'iphone', query }: { device?: DrawerDevice; query: string }) => (
  <div className={`is-drawer-empty is-drawer-empty--${device}`} role="status">
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="var(--is-foreground-high-contrast-primary-foreground)"
        d="M10.0708 10.5708C17.0134 3.62813 28.2697 3.62813 35.2124 10.5708C41.5141 16.8725 42.0954 26.728 36.9571 33.6859L44.0119 40.7407C45.0533 41.7821 45.0533 43.4705 44.0119 44.5119C42.9705 45.5533 41.2821 45.5533 40.2407 44.5119L33.1859 37.4571C26.228 42.5954 16.3725 42.0141 10.0708 35.7124C3.12813 28.7697 3.12813 17.5134 10.0708 10.5708ZM11.6421 12.1421C5.56731 18.217 5.56731 28.0662 11.6421 34.141C17.717 40.2158 27.5662 40.2158 33.641 34.141C39.7158 28.0662 39.7158 18.217 33.641 12.1421C27.5662 6.06731 17.717 6.06731 11.6421 12.1421Z"
      />
      <path
        fill="var(--is-foreground-medium-contrast-primary-foreground)"
        d="M26.7542 18.9393C27.1369 19.322 27.1369 19.9425 26.7542 20.3251L23.9826 23.0968L26.7542 25.8684C27.1369 26.2511 27.1369 26.8715 26.7542 27.2542C26.3715 27.6369 25.7511 27.6369 25.3684 27.2542L22.5968 24.4826L19.8252 27.2542C19.4425 27.6369 18.822 27.6369 18.4394 27.2542C18.0567 26.8715 18.0567 26.2511 18.4394 25.8684L21.211 23.0968L18.4394 20.3251C18.0567 19.9425 18.0567 19.322 18.4394 18.9393C18.822 18.5566 19.4425 18.5566 19.8252 18.9393L22.5968 21.711L25.3684 18.9393C25.7511 18.5566 26.3715 18.5566 26.7542 18.9393Z"
      />
    </svg>
    <p className="is-drawer-empty__text">No results were found for ”{query}”</p>
  </div>
);
