import { useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import './Tooltip.css';

/*
 * Components / Tooltip - Web — Figma "Tooltip" (3404:17227).
 * Periwinkle: a 180px callout with a title, text and ×, and a tip on one side (Figma "Yellow"/"Periwinkle"
 * variants share this look). White: a small label. Red Hat Text 13px, soft shadow.
 */

export type TooltipTone = 'periwinkle' | 'white';
/** Side of the tooltip the tip sticks out of (it points at what the tooltip is about) */
export type TooltipTip = 'top' | 'right' | 'bottom' | 'left' | 'none';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: TooltipTone;
  /** Where the tip is. Periwinkle default: right. White has none, as in Figma. */
  tip?: TooltipTip;
  /** Bold first line (Periwinkle) */
  title?: ReactNode;
  /** The text */
  children?: ReactNode;
  /** Shows the × (Periwinkle) and is called when it is clicked */
  onClose?: () => void;
  /** Width in px or any CSS length (Periwinkle default: 180) */
  width?: number | string;
}

/** Figma "Tooltip": Periwinkle callout or White label */
export const Tooltip = ({ tone = 'periwinkle', tip, title, children, onClose, width, className = '', style, ...props }: TooltipProps) => {
  const side = tip ?? (tone === 'periwinkle' ? 'right' : 'none');
  return (
    <div
      role="tooltip"
      className={['is-tooltip', `is-tooltip--${tone}`, side !== 'none' && `is-tooltip--tip-${side}`, className].filter(Boolean).join(' ')}
      style={{ ...(width !== undefined ? { width } : {}), ...style }}
      {...props}
    >
      {tone === 'periwinkle' && (title || onClose) && (
        <div className="is-tooltip__header">
          {title && <span className="is-tooltip__title">{title}</span>}
          {onClose && (
            <button type="button" className="is-tooltip__close" aria-label="Close" onClick={onClose}>
              <Icon name="close" size={12} />
            </button>
          )}
        </div>
      )}
      {children !== undefined && <div className="is-tooltip__text">{children}</div>}
    </div>
  );
};

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
const opposite: Record<TooltipPlacement, TooltipTip> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export interface WithTooltipProps {
  /** The tooltip text */
  content: ReactNode;
  /** Where the tooltip appears around the element */
  placement?: TooltipPlacement;
  tone?: TooltipTone;
  /** Bold first line (Periwinkle) */
  title?: ReactNode;
  /** Show the tip pointing at the element (default: Periwinkle only, as in Figma) */
  showTip?: boolean;
  /** Delay before showing, ms */
  delay?: number;
  width?: number | string;
  /** The element the tooltip is about */
  children: ReactNode;
}

/** Shows a Tooltip while the element is hovered or focused (Web) */
export const WithTooltip = ({ content, placement = 'top', tone = 'white', title, showTip, delay = 150, width, children }: WithTooltipProps) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  const tip = (showTip ?? tone === 'periwinkle') ? opposite[placement] : 'none';
  return (
    <span
      className="is-tooltip-anchor"
      aria-describedby={id}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      {children}
      <Tooltip
        id={id}
        tone={tone}
        tip={tip}
        title={title}
        width={width}
        className={['is-tooltip--float', `is-tooltip--at-${placement}`, open && 'is-tooltip--shown'].filter(Boolean).join(' ')}
        aria-hidden={!open}
      >
        {content}
      </Tooltip>
    </span>
  );
};
