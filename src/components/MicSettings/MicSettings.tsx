import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { Dropdown } from '../Dropdown/Dropdown';
import { IconButton } from '../IconButton/IconButton';
import type { SelectionListOption } from '../SelectionList/SelectionList';
import './MicSettings.css';

/** The microphones in the Figma sample */
export const sampleMicrophones: SelectionListOption[] = [
  { value: 'default', label: 'Default - Built-in Microphone' },
  { value: 'macbook', label: 'MacBook Pro Microphone' },
  { value: 'yeti', label: 'Blue Yeti USB Microphone' },
  { value: 'airpods', label: 'AirPods Pro' },
  { value: 'headset', label: 'External USB Headset' },
];

/** Bars in the input level meter (Figma "Input") */
export const MIC_LEVEL_BARS = 24;

export interface MicInputLevelProps {
  /** Input level from 0 to 1: that share of the 24 bars is lit */
  level?: number;
  /** Width of the meter (default 260px, as in Figma) */
  width?: number | string;
}

/** Input level meter (Figma "Input"): 24 bars, 6 × 40px, lit in Positive (periwinkle) from the left. */
export const MicInputLevel = ({ level = 1 / 3, width = 260 }: MicInputLevelProps) => {
  const lit = Math.round(Math.max(0, Math.min(1, level)) * MIC_LEVEL_BARS);
  return (
    <div
      className="is-mic-level"
      style={{ width }}
      role="meter"
      aria-label="Input level"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round((lit / MIC_LEVEL_BARS) * 100)}
    >
      {Array.from({ length: MIC_LEVEL_BARS }, (_, i) => (
        <span key={i} className={`is-mic-level__bar${i < lit ? ' is-mic-level__bar--lit' : ''}`} />
      ))}
    </div>
  );
};

export interface MicSettingsPanelProps {
  /** The microphones to choose from */
  devices?: SelectionListOption[];
  /** The selected microphone (controlled). Leave undefined to let the panel manage it. */
  value?: string;
  /** Initially selected microphone when uncontrolled */
  defaultValue?: string;
  /** Called with the microphone the user picks */
  onChange?: (value: string) => void;
  /** Input level from 0 to 1 */
  level?: number;
  /**
   * The selected microphone isn't working (Figma "Open - error" / "Selection Error"): the field gets a red border,
   * and in the open menu that microphone is red with an alert icon.
   */
  error?: boolean;
  /** Open state of the microphone menu (controlled) */
  menuOpen?: boolean;
  /** Start with the microphone menu open when uncontrolled */
  defaultMenuOpen?: boolean;
  /** Called when the microphone menu opens or closes */
  onMenuOpenChange?: (open: boolean) => void;
  /** Called by the × */
  onClose?: () => void;
}

/**
 * Microphone Settings card (Figma "Mic Settings", State=Open / Open - error / Selection Active / Selection Error):
 * a Dropdown of microphones, whose menu opens above it, and the input level meter.
 */
export const MicSettingsPanel = ({
  devices = sampleMicrophones,
  value,
  defaultValue = devices[0]?.value,
  onChange,
  level,
  error = false,
  menuOpen,
  defaultMenuOpen,
  onMenuOpenChange,
  onClose,
}: MicSettingsPanelProps) => {
  const [inner, setInner] = useState(defaultValue);
  const selected = value !== undefined ? value : inner;
  // With an error, the selected microphone is red with the alert icon (Selection List destructive row)
  const options = error ? devices.map((d) => (d.value === selected ? { ...d, destructive: true } : d)) : devices;
  return (
    <div className={`is-mic-settings-panel${error ? ' is-mic-settings-panel--error' : ''}`} role="dialog" aria-label="Microphone Settings">
      <h2 className="is-mic-settings-panel__title">Microphone Settings</h2>
      {onClose && (
        <button type="button" className="is-mic-settings-panel__close" aria-label="Close" onClick={onClose}>
          <Icon name="close" size={16} />
        </button>
      )}
      <div className="is-mic-settings-panel__group">
        <p className="is-mic-settings-panel__label">Select microphone</p>
        <Dropdown
          device="web"
          width="100%"
          options={options}
          value={selected}
          onChange={(v) => {
            if (value === undefined) setInner(v);
            onChange?.(v);
          }}
          open={menuOpen}
          defaultOpen={defaultMenuOpen}
          onOpenChange={onMenuOpenChange}
          selectedIcon={error ? 'alert-flat' : 'none'}
          aria-label="Microphone"
        />
      </div>
      <div className="is-mic-settings-panel__group">
        <p className="is-mic-settings-panel__label">Input level</p>
        <MicInputLevel level={level} />
      </div>
    </div>
  );
};

export interface MicSettingsProps extends Omit<MicSettingsPanelProps, 'onClose'> {
  /** Open state of the card (controlled) */
  open?: boolean;
  /** Start open when uncontrolled */
  defaultOpen?: boolean;
  /** Called when the card opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Where the card opens from the mic button */
  placement?: 'top' | 'bottom';
}

/**
 * Mic Settings (Figma "Mic Settings"): the mic Icon Button (Default; Alert = destructive when the microphone has a
 * problem) that opens the Microphone Settings card. × , Escape or a click outside closes it.
 */
export const MicSettings = ({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'top',
  error = false,
  ...panel
}: MicSettingsProps) => {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  // Close on a click outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpenRef.current(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      setOpenRef.current(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <div ref={root} className={`is-mic-settings is-mic-settings--${placement}`}>
      <IconButton
        ref={button}
        variant={error ? 'destructive' : 'secondary'}
        size="regular"
        icon={<Icon name="mic" />}
        label="Microphone settings"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setOpen(!isOpen)}
      />
      {isOpen && (
        <div className="is-mic-settings__card">
          <MicSettingsPanel
            {...panel}
            error={error}
            onClose={() => {
              setOpen(false);
              button.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
};
