import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Logo } from '../../icons/Logo';
import { ChromeIcon } from '../../icons/ChromeIcon';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Dropdown } from '../Dropdown/Dropdown';
import { SelectionList, type SelectionListOption } from '../SelectionList/SelectionList';
import './WebNavBar.css';

export interface WebNavBarItem {
  /** Unique value reported by onNavigate */
  value: string;
  /** Text of the menu item */
  label: string;
  /** Red text in the compact menu (e.g. "Log Out") */
  destructive?: boolean;
}

/** Menu layout: the full list, the compact dropdown, or switch automatically when the bar is too narrow */
export type WebNavBarMenuMode = 'auto' | 'default' | 'compressed';

export interface WebNavBarAvatar {
  /** Photo URL. Without it, the initials show on the accent color. */
  src?: string;
  /** Initials shown without a photo (and while it loads), e.g. "CN" */
  initials: string;
  /** Accessible name, e.g. the user's name */
  name?: string;
}

export interface WebNavBarProps {
  /** Menu items, left to right (Figma: Visits, Work List, … Log Out) */
  items: WebNavBarItem[];
  /** The current page (controlled). Leave undefined to let the bar manage it. */
  value?: string;
  /** Initially current page when uncontrolled (default: the first item) */
  defaultValue?: string;
  /** Called with the item the user picks */
  onNavigate?: (value: string) => void;
  /**
   * "auto" (default) shows the full menu and compacts it into a dropdown when the bar is too narrow;
   * "default" and "compressed" force one layout (Figma Menu State=Default / Compressed).
   */
  menu?: WebNavBarMenuMode;

  /** Show the "Download Chrome Extension" button (default true) */
  chromeExtension?: boolean;
  /** Label of the Chrome extension button */
  chromeExtensionLabel?: string;
  onChromeExtensionClick?: () => void;

  /** Practices in the dropdown on the right. Leave empty to hide the dropdown. */
  practices?: SelectionListOption[];
  /** Selected practice (controlled) */
  practice?: string | null;
  /** Initially selected practice when uncontrolled */
  defaultPractice?: string | null;
  onPracticeChange?: (value: string) => void;

  /** User avatar (Figma "Avatar/Photo"). When set, it opens the account menu. */
  avatar?: WebNavBarAvatar;
  /** Rows of the avatar's menu (Figma: My Account, Log Out) */
  accountItems?: SelectionListOption[];
  onAccountSelect?: (value: string) => void;

  /** Called by the search button. Leave undefined to hide it. */
  onSearch?: () => void;
  /** Called by the connectivity button. Leave undefined to hide it. */
  onConnectivityClick?: () => void;
  /** Show the red alert badge on the connectivity button */
  connectivityAlert?: boolean;

  /** Replaces the iScribe logo on the left */
  logo?: ReactNode;
  /** Accessible name of the navigation (default "Main") */
  'aria-label'?: string;
}

/** Open/close state for a small popover menu: closes on a click outside and on Escape */
const usePopover = () => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);
  // Focus the selected (or first) row when the menu opens
  useEffect(() => {
    if (open) root.current?.querySelector<HTMLElement>('.is-web-nav__popover [role="option"][tabindex="0"]')?.focus();
  }, [open]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  };
  return { open, setOpen, root, trigger, onKeyDown };
};

/** The full menu: one ghost Button per item; the current one is highlighted (Figma Menu State=Default) */
const MenuList = ({ items, current, onPick, measure }: { items: WebNavBarItem[]; current?: string; onPick?: (v: string) => void; measure?: boolean }) => (
  <div className="is-web-nav__menu">
    {items.map((item) => (
      <Button
        key={item.value}
        variant="ghost"
        size="small"
        className="is-web-nav__item"
        data-state={item.value === current ? 'active' : undefined}
        aria-current={item.value === current && !measure ? 'page' : undefined}
        tabIndex={measure ? -1 : undefined}
        onClick={() => onPick?.(item.value)}
      >
        {item.label}
      </Button>
    ))}
  </div>
);

/**
 * Web Nav Bar (Figma "Web Nav Bar"): logo and menu on the left; Chrome extension, practice dropdown,
 * avatar, search and connectivity on the right. When the bar is too narrow for the whole menu, the
 * menu compacts into a button that opens a Selection List of the same items.
 */
export const WebNavBar = ({
  items,
  value,
  defaultValue,
  onNavigate,
  menu = 'auto',
  chromeExtension = true,
  chromeExtensionLabel = 'Download Chrome Extension',
  onChromeExtensionClick,
  practices,
  practice,
  defaultPractice,
  onPracticeChange,
  avatar,
  accountItems = [
    { value: 'account', label: 'My Account' },
    { value: 'logout', label: 'Log Out', destructive: true },
  ],
  onAccountSelect,
  onSearch,
  onConnectivityClick,
  connectivityAlert = false,
  logo,
  'aria-label': ariaLabel = 'Main',
}: WebNavBarProps) => {
  const [inner, setInner] = useState<string | undefined>(defaultValue ?? items[0]?.value);
  const current = value !== undefined ? value : inner;
  const currentItem = items.find((i) => i.value === current);

  // ---- Auto compaction: compare the full menu's natural width with the room left for it ----
  const slot = useRef<HTMLDivElement>(null);
  const measurer = useRef<HTMLDivElement>(null);
  const [tooNarrow, setTooNarrow] = useState(false);
  useLayoutEffect(() => {
    if (menu !== 'auto') return;
    const check = () => {
      if (!slot.current || !measurer.current) return;
      setTooNarrow(measurer.current.scrollWidth > slot.current.clientWidth + 0.5);
    };
    check();
    const ro = new ResizeObserver(check);
    if (slot.current) ro.observe(slot.current);
    if (measurer.current) ro.observe(measurer.current);
    return () => ro.disconnect();
  }, [menu, items]);
  const compressed = menu === 'compressed' || (menu === 'auto' && tooNarrow);

  const menuPop = usePopover();
  const accountPop = usePopover();
  useEffect(() => {
    if (!compressed) menuPop.setOpen(false);
  }, [compressed]);

  const navigate = (next: string) => {
    if (value === undefined) setInner(next);
    onNavigate?.(next);
  };

  return (
    <nav className={`is-web-nav${compressed ? ' is-web-nav--compressed' : ''}`} aria-label={ariaLabel}>
      <div className="is-web-nav__left">
        <span className="is-web-nav__logo">{logo ?? <Logo width={68} />}</span>
        <div ref={slot} className="is-web-nav__slot">
          {compressed ? (
            /* Figma Menu State=Compressed: the current page with a menu icon, opening a Selection List */
            <div ref={menuPop.root} className="is-web-nav__pop-root" onKeyDown={menuPop.onKeyDown}>
              <button
                ref={menuPop.trigger}
                type="button"
                className="is-button is-button--ghost is-button--small is-web-nav__compact"
                data-state="active"
                aria-haspopup="listbox"
                aria-expanded={menuPop.open}
                aria-label={`Menu: ${currentItem?.label ?? ''}`}
                onClick={() => menuPop.setOpen(!menuPop.open)}
              >
                <span className="is-button__icon" aria-hidden="true">
                  <Icon name="sandwich" />
                </span>
                <span className="is-button__label">{currentItem?.label ?? 'Menu'}</span>
              </button>
              {menuPop.open && (
                <div className="is-web-nav__popover is-web-nav__popover--start">
                  <SelectionList
                    options={items}
                    value={current}
                    device="web"
                    width="max-content"
                    selectedIcon="none"
                    aria-label={ariaLabel}
                    onChange={(v) => {
                      navigate(v);
                      menuPop.setOpen(false);
                      menuPop.trigger.current?.focus();
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <MenuList items={items} current={current} onPick={navigate} />
          )}
        </div>
        {/* Invisible copy of the full menu, measured to decide when to compact */}
        {menu === 'auto' && (
          <div ref={measurer} className="is-web-nav__measure" aria-hidden="true" inert>
            <MenuList items={items} current={current} measure />
          </div>
        )}
      </div>

      <div className="is-web-nav__right">
        {chromeExtension && (
          <>
            <Button variant="secondary" size="small" iconLeft={<ChromeIcon />} onClick={onChromeExtensionClick}>
              {chromeExtensionLabel}
            </Button>
            <span className="is-web-nav__divider" aria-hidden="true" />
          </>
        )}
        <div className="is-web-nav__tools">
          {practices && practices.length > 0 && (
            <Dropdown
              options={practices}
              value={practice}
              defaultValue={defaultPractice ?? practices[0]?.value}
              onChange={onPracticeChange}
              device="web"
              width={220}
              menuWidth={310}
              visibleRows={9}
              selectedIcon="none"
              aria-label="Practice"
            />
          )}
          {avatar && (
            <div ref={accountPop.root} className="is-web-nav__pop-root" onKeyDown={accountPop.onKeyDown}>
              <button
                ref={accountPop.trigger}
                type="button"
                className="is-web-nav__avatar"
                aria-haspopup="listbox"
                aria-expanded={accountPop.open}
                aria-label={avatar.name ? `Account: ${avatar.name}` : 'Account'}
                onClick={() => accountPop.setOpen(!accountPop.open)}
              >
                <span aria-hidden="true">{avatar.initials}</span>
                {avatar.src && <img src={avatar.src} alt="" />}
              </button>
              {accountPop.open && (
                <div className="is-web-nav__popover is-web-nav__popover--end">
                  <SelectionList
                    options={accountItems}
                    value={null}
                    device="web"
                    width="max-content"
                    selectedIcon="none"
                    aria-label="Account"
                    onChange={(v) => {
                      onAccountSelect?.(v);
                      accountPop.setOpen(false);
                      accountPop.trigger.current?.focus();
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {onSearch && <IconButton icon={<Icon name="search" />} label="Search" variant="ghost" size="small" onClick={onSearch} />}
          {onConnectivityClick && (
            <span className="is-web-nav__badge-host">
              <IconButton
                icon={<Icon name="connectivity" />}
                label={connectivityAlert ? 'Connectivity (needs attention)' : 'Connectivity'}
                variant="ghost"
                size="small"
                onClick={onConnectivityClick}
              />
              {connectivityAlert && <Icon name="alert-flat" className="is-web-nav__badge" />}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
