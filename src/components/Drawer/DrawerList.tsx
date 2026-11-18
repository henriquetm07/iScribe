import { useRef, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { RtnLabel, type RtnLabelTone } from '../RTNItems/RTNItems';
import '../Button/Button.css';
import '../IconButton/IconButton.css';
import { useThemeAround } from '../ScheduleList/ScheduleList';
import type { DrawerDevice } from './DrawerHeader';
import '../RTNItems/RTNItems.css';
import './Drawer.css';

/*
 * The content of the Drawer's main area in Figma "Drawer List Modal": the list (a title per group, e.g.
 * "Added Macros" / "All Macros" / "Search Results"), the Drawer Macro List Item, the Drawer Diagnoses List Item
 * (also used for Orders) and the "No results" message.
 * Web uses the compact (iPhone) sizes, like its Drawer Header.
 */

/** Figma "List items": the column of titles and items, 20px padding, 10px apart */
export const DrawerList = ({ children }: { children: ReactNode }) => <div className="is-drawer-list">{children}</div>;

/** A group title in the list, e.g. "Added Macros" (Figtree Medium 15px · 17px on iPad) */
export const DrawerListTitle = ({ device = 'iphone', children }: { device?: DrawerDevice; children: ReactNode }) => (
  <p className={`is-drawer-list__title is-drawer-list__title--${device}`}>{children}</p>
);

/**
 * The wipes played together when an item gets added: the old place closes (wipe-out, bottom to top) while the Added
 * version opens on top (wipe-in, top to bottom), both in the same time
 */
export type DrawerItemMotion = 'wipe-out' | 'wipe-in';

const itemClass = (device: DrawerDevice, added: boolean) =>
  ['is-drawer-item', `is-drawer-item--${device}`, added && 'is-drawer-item--added'].filter(Boolean).join(' ');

/** The item's slot in the list: it opens or closes for the wipes */
const Slot = ({ motion, children }: { motion?: DrawerItemMotion; children: ReactNode }) => (
  <div className={['is-drawer-item-slot', motion && `is-drawer-item-slot--${motion}`].filter(Boolean).join(' ')}>{children}</div>
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
  /** Wipe animation to play (see DrawerSample) */
  motion?: DrawerItemMotion;
}

/** Figma "Drawer Macro List Item": Default (outlined, +) or Added (dark, ×) */
export const DrawerMacroListItem = ({ device = 'iphone', name, section, source, added = false, onToggle, motion }: DrawerMacroListItemProps) => {
  const big = device === 'ipad';
  return (
    <Slot motion={motion}>
    <button
      type="button"
      className={itemClass(device, added)}
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
    </Slot>
  );
};

export interface DrawerDiagnosesListItemProps {
  device?: DrawerDevice;
  /** The diagnosis or order */
  name: string;
  /** Its label: the ICD code (e.g. "S83.241A") or the order type (e.g. "Lab", "Imaging") */
  label: string;
  /** Added: dark, with × to remove it (the label stays, in its dark version). Otherwise outlined, with +. */
  added?: boolean;
  /** Called with the tap: adds it, or removes it when added */
  onToggle?: () => void;
  /** Wipe animation to play (see DrawerSample) */
  motion?: DrawerItemMotion;
}

/** Figma "Drawer Diagnoses List Item" (Diagnoses and Orders): name and label, Default (+) or Added (dark, ×) */
export const DrawerDiagnosesListItem = ({ device = 'iphone', name, label, added = false, onToggle, motion }: DrawerDiagnosesListItemProps) => {
  const big = device === 'ipad';
  const ref = useRef<HTMLSpanElement>(null);
  const around = useThemeAround(ref);
  return (
    <Slot motion={motion}>
    <button
      type="button"
      className={itemClass(device, added)}
      aria-pressed={added}
      aria-label={`${added ? 'Remove' : 'Add'} ${name} (${label})`}
      onClick={onToggle}
    >
      <span className="is-drawer-item__text">
        <span className="is-drawer-item__name">{name}</span>
        {/* On the dark Added item the label uses the other mode's colours */}
        <span ref={ref} className="is-drawer-item__label" data-theme={added ? (around === 'dark' ? 'light' : 'dark') : undefined}>
          <RtnLabel device={big ? 'ipad' : 'iphone'} size={big ? 'medium' : 'small'}>
            {label}
          </RtnLabel>
        </span>
      </span>
      <span className="is-drawer-item__action" aria-hidden="true">
        <Icon name={added ? 'close' : 'add'} size={big ? 20 : 16} />
      </span>
    </button>
    </Slot>
  );
};

export interface DrawerChecklistItemProps {
  device?: DrawerDevice;
  /** The section or entry, e.g. "History of Present Illness" */
  name: string;
  /** Section icon. Leave empty for an entry under a section: the empty icon space indents it. */
  icon?: IconName;
  /** Code before the name, e.g. "I10" or "99870" */
  label?: string;
  /** Neutral (low contrast) or accent (periwinkle) label, e.g. accent for billing codes */
  labelTone?: Extract<RtnLabelTone, 'neutral' | 'accent'>;
  /** Added (Figma "Value"): green, with a check. Otherwise a + Icon Button. */
  added?: boolean;
  /** Called with the tap: adds it, or removes it when added */
  onToggle?: () => void;
}

/**
 * Figma "Copy from Previous Note Item" (831:10473): a row of the "Add from Previous Note" checklist — icon, optional
 * code label and name, then the + (secondary Icon Button: iPhone 20px · Web 30px · iPad 40px) or, once added, the
 * green Value state with a check. The whole row is the button.
 */
export const DrawerChecklistItem = ({ device = 'iphone', name, icon, label, labelTone = 'neutral', added = false, onToggle }: DrawerChecklistItemProps) => {
  const big = device === 'ipad';
  return (
    <button
      type="button"
      className={['is-drawer-check', `is-drawer-check--${device}`, added && 'is-drawer-check--added'].filter(Boolean).join(' ')}
      aria-pressed={added}
      aria-label={`${added ? 'Remove' : 'Add'} ${label ? `${label} ` : ''}${name}`}
      onClick={onToggle}
    >
      <span className="is-drawer-check__main">
        <span className="is-drawer-check__icon" aria-hidden="true">
          {icon && <Icon name={icon} size="100%" />}
        </span>
        <span className="is-drawer-check__title">
          {label && (
            <RtnLabel device={big ? 'ipad' : 'iphone'} size={big ? 'big' : 'medium'} tone={labelTone}>
              {label}
            </RtnLabel>
          )}
          <span className="is-drawer-check__name">{name}</span>
        </span>
      </span>
      {added ? (
        <span className="is-drawer-check__check" aria-hidden="true">
          <Icon name="check" size="100%" />
        </span>
      ) : (
        // The + is the secondary Icon Button (Button.css), drawn inside the row's button
        <span
          className={`is-button is-button--secondary is-button--${device === 'ipad' ? 'regular' : device === 'web' ? 'small' : 'mini'} is-icon-button is-drawer-check__add`}
          aria-hidden="true"
        >
          <span className="is-button__icon">
            <Icon name="add" />
          </span>
        </span>
      )}
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
