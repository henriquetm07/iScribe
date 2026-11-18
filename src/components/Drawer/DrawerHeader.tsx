import { useRef, useState, type HTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { IconButton } from '../IconButton/IconButton';
import './DrawerHeader.css';

/*
 * Components / Drawer / Drawer Header — Figma "Drawer - Header" (915:13996).
 * Drawer Header Title (icon, Season Mix title, description) and the Drawer Header: the title, the × close in the
 * top-right corner, then a search field and the filter Icon Button with its count badge. iPhone · iPad · Web.
 */

export type DrawerDevice = 'iphone' | 'ipad' | 'web';

export interface DrawerHeaderTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  device?: DrawerDevice;
  /** Icon before the title */
  icon?: IconName;
  title?: string;
  /** Line under the title. Leave empty for none. */
  description?: string;
}

/** Figma "Drawer Header Title": icon, title (Season Mix) and description */
export const DrawerHeaderTitle = ({
  device = 'iphone',
  icon = 'macros',
  title = 'Add Macros',
  description = 'Search and select macro items to add to the current encounter.',
  className = '',
  ...props
}: DrawerHeaderTitleProps) => (
  <div className={['is-drawer-title', `is-drawer-title--${device}`, className].filter(Boolean).join(' ')} {...props}>
    <span className="is-drawer-title__icon" aria-hidden="true">
      <Icon name={icon} size={device === 'ipad' ? 20 : 16} />
    </span>
    <div className="is-drawer-title__text">
      <h2 className="is-drawer-title__name">{title}</h2>
      {description && <p className="is-drawer-title__description">{description}</p>}
    </div>
  </div>
);

export interface DrawerHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  device?: DrawerDevice;
  icon?: IconName;
  title?: string;
  description?: string;
  /** Show the × close button (top-right) */
  closeButton?: boolean;
  onClose?: () => void;
  /** Show the search field */
  search?: boolean;
  searchPlaceholder?: string;
  /** Search text (controlled). Leave undefined to let the field keep its own text. Typing shows a × that clears it. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Show the filter Icon Button next to the search field */
  filter?: boolean;
  onFilter?: () => void;
  /** Number in the blue badge on the filter button (Figma "Notification"). 0 or undefined hides it. */
  filterCount?: number;
  /** Width of the header, in px or any CSS length (Figma: 375) */
  width?: number | string;
}

/** Figma "Drawer Header": the top of a drawer — title, close, search and filter */
export const DrawerHeader = ({
  device = 'iphone',
  icon,
  title,
  description,
  closeButton = true,
  onClose,
  search = true,
  searchPlaceholder = 'Search Macros...',
  searchValue,
  onSearchChange,
  filter = true,
  onFilter,
  filterCount = 12,
  width = 375,
  className = '',
  style,
  ...props
}: DrawerHeaderProps) => {
  const big = device === 'ipad';
  const inputRef = useRef<HTMLInputElement>(null);
  // Uncontrolled unless searchValue is given
  const [ownText, setOwnText] = useState('');
  const text = searchValue ?? ownText;
  const changeText = (value: string) => {
    if (searchValue === undefined) setOwnText(value);
    onSearchChange?.(value);
  };
  return (
    <div
      className={['is-drawer-header', `is-drawer-header--${device}`, className].filter(Boolean).join(' ')}
      style={{ width, ...style }}
      {...props}
    >
      <DrawerHeaderTitle device={device} icon={icon} title={title} description={description} />
      {closeButton && (
        <button type="button" className="is-drawer-header__close" aria-label="Close" title="Close" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
      {(search || filter) && (
        <div className="is-drawer-header__search">
          {search && (
            <label className="is-drawer-search">
              <Icon name="search" size={big ? 30 : 20} />
              <input
                ref={inputRef}
                type="search"
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder.replace(/\.+$|…$/, '')}
                value={text}
                onChange={(e) => changeText(e.target.value)}
              />
              {text && (
                <button
                  type="button"
                  className="is-drawer-search__clear"
                  aria-label="Clear search"
                  onClick={() => {
                    changeText('');
                    inputRef.current?.focus();
                  }}
                >
                  <Icon name="close" size={big ? 30 : 20} />
                </button>
              )}
            </label>
          )}
          {filter && (
            <span className="is-drawer-header__filter">
              <IconButton
                variant="secondary"
                size={big ? 'xl' : 'regular'}
                icon={<Icon name="filter" />}
                label={filterCount ? `Filters (${filterCount})` : 'Filters'}
                onClick={onFilter}
              />
              {!!filterCount && (
                <span className="is-drawer-header__badge" aria-hidden="true">
                  {filterCount}
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
