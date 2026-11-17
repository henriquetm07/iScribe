import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatedIcon } from '../../icons/AnimatedIcon';
import type { AnimatedIconName } from '../../icons/animatedIcons';
import './AppointmentStatus.css';

/*
 * Appointment Status — Figma "Appointment Status" (1067:23721). Two parts:
 *   AppointmentStatusIcon   the 20px status icon (Figma "Appointment Status Icons")
 *   AppointmentStatus       the icon with its label (Figma "Appointment Status")
 * Colours are the Figma variables (Foreground and Status), so light and dark mode follow data-theme.
 */

export type AppointmentStatusValue =
  | 'new-note'
  | 'not-checked-in'
  | 'checked-in'
  | 'checked-out'
  | 'note-in-progress'
  | 'sent-to-ehr'
  | 'copied-to-ehr'
  | 'failed';

/** The statuses in Figma order, with their labels */
export const appointmentStatuses: { value: AppointmentStatusValue; label: string }[] = [
  { value: 'new-note', label: 'New Note' },
  { value: 'not-checked-in', label: 'Not Checked-in' },
  { value: 'checked-in', label: 'Checked-in' },
  { value: 'checked-out', label: 'Checked-out' },
  { value: 'note-in-progress', label: 'Note in Progress' },
  { value: 'sent-to-ehr', label: 'Sent to EHR' },
  { value: 'copied-to-ehr', label: 'Copied to EHR' },
  { value: 'failed', label: 'Failed' },
];

export const appointmentStatusLabel = (status: AppointmentStatusValue) =>
  appointmentStatuses.find((s) => s.value === status)?.label ?? status;

/* ---------- Icon artwork (20 × 20, exported from the Figma components) ---------- */

/** Dotted circle (Figma "Circle (Stroke)"): 1px dots, evenly spaced around a 20px circle */
const DottedCircle = () => (
  <circle className="is-apt-stroke-mid" cx="10" cy="10" r="9.5" pathLength="60" strokeDasharray="1.05 0.95" />
);

/** Each status's artwork; a function when it needs an id (for a mask), given one unique to the icon */
const artwork: Record<AppointmentStatusValue, ReactNode | ((id: string) => ReactNode)> = {
  // High contrast: patient in a dotted rounded square
  'new-note': (
    <>
      <rect className="is-apt-stroke-hi" x="0.5" y="0.5" width="19" height="19" rx="2.5" strokeDasharray="1 1" />
      <path className="is-apt-fill-hi" d="M10.0001 10.88C11.5668 10.88 13.0005 11.4348 14.1051 12.3538C15.4838 13.501 14.2401 15.28 12.4267 15.28H7.57253C5.75927 15.2798 4.51635 13.5009 5.89505 12.3538C6.99964 11.4349 8.43329 10.88 10.0001 10.88Z" />
      <path className="is-apt-fill-hi" d="M10.0001 4.71997C11.497 4.72012 12.7108 5.90203 12.7108 7.35997C12.7108 8.81791 11.497 9.99983 10.0001 9.99997C8.50293 9.99997 7.28927 8.818 7.28927 7.35997C7.28927 5.90194 8.50293 4.71997 10.0001 4.71997Z" />
    </>
  ),
  // Medium contrast: patient in a dotted circle
  'not-checked-in': (
    <>
      <path className="is-apt-fill-mid" d="M10.0001 10.88C11.5668 10.88 13.0005 11.4348 14.1051 12.3538C15.4838 13.501 14.2401 15.28 12.4267 15.28H7.57253C5.75927 15.2798 4.51635 13.5009 5.89505 12.3538C6.99964 11.4349 8.43329 10.88 10.0001 10.88Z" />
      <path className="is-apt-fill-mid" d="M10.0001 4.71997C11.497 4.72012 12.7108 5.90203 12.7108 7.35997C12.7108 8.81791 11.497 9.99983 10.0001 9.99997C8.50293 9.99997 7.28927 8.818 7.28927 7.35997C7.28927 5.90194 8.50293 4.71997 10.0001 4.71997Z" />
      <DottedCircle />
    </>
  ),
  // High contrast: patient in a circle
  'checked-in': (
    <>
      <path className="is-apt-stroke-hi" d="M10 0.5C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5Z" />
      <path className="is-apt-fill-hi" d="M10.0001 10.88C11.5668 10.88 13.0005 11.4348 14.1051 12.3538C15.4838 13.501 14.2401 15.28 12.4267 15.28H7.57253C5.75927 15.2798 4.51635 13.5009 5.89505 12.3538C6.99964 11.4349 8.43329 10.88 10.0001 10.88Z" />
      <path className="is-apt-fill-hi" d="M10.0001 4.71997C11.497 4.72012 12.7108 5.90203 12.7108 7.35997C12.7108 8.81791 11.497 9.99983 10.0001 9.99997C8.50293 9.99997 7.28927 8.818 7.28927 7.35997C7.28927 5.90194 8.50293 4.71997 10.0001 4.71997Z" />
    </>
  ),
  // Medium contrast: dotted circle with a dotted diagonal through the patient
  'checked-out': (
    <>
      <DottedCircle />
      <path className="is-apt-fill-mid" d="M10.0001 10.88C11.5668 10.88 13.0005 11.4348 14.1051 12.3538C15.4838 13.501 14.2401 15.28 12.4267 15.28H7.57253C5.75927 15.2798 4.51635 13.5009 5.89505 12.3538C6.99964 11.4349 8.43329 10.88 10.0001 10.88Z" />
      <path className="is-apt-fill-mid" d="M10.0001 4.71997C11.497 4.72012 12.7108 5.90203 12.7108 7.35997C12.7108 8.81791 11.497 9.99983 10.0001 9.99997C8.50293 9.99997 7.28927 8.818 7.28927 7.35997C7.28927 5.90194 8.50293 4.71997 10.0001 4.71997Z" />
      <path className="is-apt-fill-mid" d="M4.44356 14.8492L5.15067 15.5563L4.45668 16.2503L3.74957 15.5432L4.44356 14.8492ZM5.83084 13.4619L6.53795 14.1691L5.84396 14.863L5.13686 14.1559L5.83084 13.4619ZM7.21812 12.0747L7.92523 12.7818L7.23124 13.4758L6.52414 12.7686L7.21812 12.0747ZM8.60541 10.6874L9.31251 11.3945L8.61922 12.0878L7.91211 11.3807L8.60541 10.6874ZM9.99338 9.2994L10.7005 10.0065L10.0065 10.7005L9.29939 9.99339L9.99338 9.2994ZM11.3807 7.91212L12.0878 8.61923L11.3938 9.31322L10.6867 8.60611L11.3807 7.91212ZM12.7679 6.52484L13.4751 7.23195L12.7811 7.92593L12.074 7.21883L12.7679 6.52484ZM14.1552 5.13756L14.8623 5.84466L14.169 6.53796L13.4619 5.83085L14.1552 5.13756ZM15.5432 3.74958L16.2503 4.45669L15.5563 5.15068L14.8492 4.44357L15.5432 3.74958Z" />
    </>
  ),
  // High contrast: the iScribe waves in a circle
  'note-in-progress': (
    <>
      <path className="is-apt-stroke-hi" d="M10 0.5C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5Z" />
      <path className="is-apt-fill-hi" fillRule="evenodd" d="M15.8292 10.0559C12.6051 6.61625 7.39494 6.61625 4.17082 10.0559C3.91386 10.33 3.48485 10.3425 3.21259 10.0837C2.94033 9.82501 2.92793 9.39304 3.18489 9.1189C6.94405 5.10848 13.056 5.10848 16.8151 9.1189C17.0721 9.39304 17.0597 9.82502 16.7874 10.0838C16.5151 10.3425 16.0861 10.33 15.8292 10.0559Z" />
      <path className="is-apt-fill-hi" fillRule="evenodd" d="M14.1377 11.8664C11.8488 9.42453 8.15498 9.42453 5.86614 11.8664C5.60918 12.1405 5.18016 12.153 4.9079 11.8943C4.63565 11.6355 4.62324 11.2036 4.8802 10.9294C7.7041 7.91676 12.2997 7.91676 15.1236 10.9294C15.3806 11.2036 15.3682 11.6355 15.0959 11.8943C14.8236 12.153 14.3946 12.1405 14.1377 11.8664Z" />
      <path className="is-apt-fill-hi" fillRule="evenodd" d="M12.4416 13.6749C11.0892 12.2322 8.9138 12.2322 7.56144 13.6749C7.30448 13.949 6.87546 13.9615 6.60321 13.7028C6.33095 13.444 6.31856 13.0121 6.57552 12.7379C8.46293 10.7244 11.5401 10.7244 13.4275 12.7379C13.6845 13.0121 13.6721 13.444 13.3998 13.7028C13.1275 13.9615 12.6985 13.949 12.4416 13.6749Z" />
    </>
  ),
  // Positive: "send" on a green disc. The plane is drawn exactly as in the "sent-to-ehr" animation
  // (a thin round-cornered line on its 240 grid), so the animation hands back to this icon without a jump.
  'sent-to-ehr': (
    <>
      <path className="is-apt-fill-bg-positive" fillRule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" />
      <svg width="20" height="20" viewBox="0 0 240 240" className="is-apt-plane">
        <g transform="translate(114.387 123.627)">
          <path d="M44.8 -42.2L11.8 50L-6.6 8.4L-48 -10Z" />
          <path d="M44.8 -42.2L-6.6 8.4" />
        </g>
      </svg>
    </>
  ),
  // Positive: "copy" on a green disc. The squares are drawn exactly as the first and last frame of the
  // "copied-to-ehr" animation (two 62px rounded squares on its 240 grid; the back one cut away by a 72px,
  // 13px-radius square around the front one), so the animation and the icon match.
  'copied-to-ehr': (id) => (
    <>
      <path className="is-apt-fill-bg-positive" fillRule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" />
      <svg width="20" height="20" viewBox="0 0 240 240" className="is-apt-squares">
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
          <rect width="240" height="240" fill="white" />
          <rect x="74" y="92" width="72" height="72" rx="13" fill="black" />
        </mask>
        <rect x="97" y="79" width="62" height="62" rx="8" mask={`url(#${id})`} />
        <rect x="79" y="97" width="62" height="62" rx="8" />
      </svg>
    </>
  ),
  // Alert: "alert" on a pink disc
  failed: (
    <>
      <path className="is-apt-fill-bg-alert" fillRule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" />
      <path className="is-apt-fill-fg-alert" d="M10 11.667C10.4602 11.667 10.833 12.0398 10.833 12.5C10.833 12.9602 10.4602 13.333 10 13.333C9.53976 13.333 9.16699 12.9602 9.16699 12.5C9.167 12.0398 9.53977 11.667 10 11.667Z" />
      <path className="is-apt-fill-fg-alert" d="M10 6.66699C10.46 6.66717 10.8338 7.04002 10.834 7.5V10C10.8338 10.46 10.46 10.8338 10 10.834C9.54001 10.8338 9.16716 10.46 9.16699 10V7.5C9.16717 7.04002 9.54002 6.66717 10 6.66699Z" />
      <path className="is-apt-fill-fg-alert" fillRule="evenodd" d="M10 5C12.7614 5 15 7.23858 15 10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5ZM10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14C12.2091 14 14 12.2091 14 10C14 7.79086 12.2091 6 10 6Z" />
    </>
  ),
};

/* ---------- Icon ---------- */

export interface AppointmentStatusIconProps {
  /** Which status to show */
  status: AppointmentStatusValue;
  /** Width and height in px (Figma: 20) */
  size?: number;
  /** Accessible name. Defaults to the status label; pass "" when a visible label sits next to it. */
  title?: string;
  /**
   * Animate on arrival (default true): when the status changes to Sent to EHR or Copied to EHR, its animation
   * plays once (Foundations / Animated Icons, "sent-to-ehr" and "copied-to-ehr"). The first render is static.
   */
  animate?: boolean;
  className?: string;
}

/** Statuses that play a one-time animation when an appointment changes to them, on their green disc */
const arrivals: Partial<Record<AppointmentStatusValue, AnimatedIconName>> = {
  'sent-to-ehr': 'sent-to-ehr',
  'copied-to-ehr': 'copied-to-ehr',
};

/** Figma "Appointment Status Icons": the 20px icon for an appointment's status */
export const AppointmentStatusIcon = ({ status, size = 20, title, animate = true, className = '' }: AppointmentStatusIconProps) => {
  const name = title ?? appointmentStatusLabel(status);
  const uid = useId();
  const art = artwork[status];
  const drawing = (suffix: string) => (typeof art === 'function' ? art(`is-apt${uid}${suffix}`) : art);
  // Play the arrival animation once when the status becomes Sent to EHR or Copied to EHR (not when it starts there)
  const previous = useRef(status);
  const [flying, setFlying] = useState(false);
  useEffect(() => {
    if (status !== previous.current) setFlying(animate && status in arrivals);
    previous.current = status;
  }, [status, animate]);

  const arrival = flying ? arrivals[status] : undefined;
  if (arrival) {
    // The green disc stays put; the animation (240 grid, lined up with the static icon) plays on top, clipped to
    // the circle. When it ends it stays on its last frame — identical to the static icon — rather than swapping
    // back, so there is no hand-off to see. Changing the status again resets it.
    return (
      <span
        className={`is-apt-icon is-apt-flight ${className}`}
        style={{ width: size, height: size }}
        role={name ? 'img' : undefined}
        aria-label={name || undefined}
        aria-hidden={name ? undefined : true}
      >
        <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path className="is-apt-fill-bg-positive" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" />
        </svg>
        <AnimatedIcon
          name={arrival}
          size={size}
          className="is-apt-flight__plane"
          // The static icon, until the animation player has loaded
          fallback={
            <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
              {drawing('f')}
            </svg>
          }
        />
      </span>
    );
  }

  return (
    <svg
      className={`is-apt-icon is-apt-icon--${status} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
    >
      {drawing('s')}
    </svg>
  );
};

/* ---------- Icon + label ---------- */

export interface AppointmentStatusProps {
  /** Which status to show */
  status: AppointmentStatusValue;
  /** Text next to the icon; defaults to the status name (e.g. "Sent to EHR") */
  label?: string;
  /** Play the one-time animation when the status changes to Sent to EHR or Copied to EHR (default true) */
  animate?: boolean;
  className?: string;
}

/** Figma "Appointment Status": the status icon followed by its label (Figtree Medium 11px, 8px apart) */
export const AppointmentStatus = ({ status, label, animate = true, className = '' }: AppointmentStatusProps) => (
  <span className={`is-apt-status ${className}`}>
    <AppointmentStatusIcon status={status} title="" animate={animate} />
    <span className="is-apt-status__label">{label ?? appointmentStatusLabel(status)}</span>
  </span>
);
