import { useId } from 'react';
import { ehrLogoSvgs } from './ehrLogos';
import './EhrIcon.css';

/* ---------- EHRs ---------- */

export type EhrName = 'athena' | 'nextgen' | 'greenway-health' | 'touchworks' | 'epic' | 'veradigm';

/** The EHRs iScribe integrates with, in Figma order */
export const ehrs: { value: EhrName; label: string }[] = [
  { value: 'athena', label: 'Athena' },
  { value: 'nextgen', label: 'NextGen' },
  { value: 'greenway-health', label: 'Greenway Health' },
  { value: 'touchworks', label: 'Touchworks' },
  { value: 'epic', label: 'Epic' },
  { value: 'veradigm', label: 'Veradigm' },
];

export const ehrLabel = (ehr: EhrName) => ehrs.find((e) => e.value === ehr)?.label ?? ehr;

/**
 * Where each logo sits in its 20px tile (Figma "EHR Logos" insets), and whether it sits on the logo background
 * tile. Veradigm is dark, so it gets var(--is-background-logo-background), which turns light in dark mode.
 */
const placement: Record<EhrName, { inset: string; tile?: boolean }> = {
  athena: { inset: '12.84% 15.06%' },
  nextgen: { inset: '0' },
  'greenway-health': { inset: '10% 14% 12.42% 10%' },
  touchworks: { inset: '10% 11% 10% 9%' },
  epic: { inset: '0' },
  veradigm: { inset: '10% 11% 10% 9%', tile: true },
};

/* ---------- Logo ---------- */

export interface EhrLogoProps {
  /** Which EHR */
  ehr: EhrName;
  /** Width and height in px (Figma: 20) */
  size?: number;
  /** Accessible name. Defaults to the EHR's name; pass "" when a visible label sits next to it. */
  title?: string;
  className?: string;
}

/** Figma "EHR Logos": an EHR's logo in its own colours, in a 20px tile with 4px corners */
export const EhrLogo = ({ ehr, size = 20, title, className = '' }: EhrLogoProps) => {
  // Gradient ids made unique to this logo, so several logos on a page never share (or lose) a gradient
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svg = ehrLogoSvgs[ehr].replace(/(id="|url\(#)(paint[^")]*)/g, `$1$2-${uid}`);
  const name = title ?? ehrLabel(ehr);
  const { inset, tile } = placement[ehr];
  return (
    <span
      className={`is-ehr-logo${tile ? ' is-ehr-logo--tile' : ''} ${className}`}
      style={{ width: size, height: size }}
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
    >
      <span className="is-ehr-logo__art" style={{ inset }} dangerouslySetInnerHTML={{ __html: svg }} />
    </span>
  );
};

/* ---------- Icon ---------- */

export interface EhrIconProps {
  /** Which EHR the appointment is in (shown when integrated) */
  ehr?: EhrName;
  /** Integrated: the EHR's logo. Not integrated: the link icon. */
  integrated?: boolean;
  /** Width and height in px (Figma: 20) */
  size?: number;
  /** Accessible name. Defaults to "Integrated with <EHR>" or "Not integrated"; pass "" when a visible label sits next to it. */
  title?: string;
  className?: string;
}

/** Figma "EHR Icons": whether an appointment is linked to an EHR. Integrated shows the EHR's logo, not integrated a link icon. */
export const EhrIcon = ({ ehr = 'athena', integrated = false, size = 20, title, className = '' }: EhrIconProps) => {
  if (integrated) return <EhrLogo ehr={ehr} size={size} title={title ?? `Integrated with ${ehrLabel(ehr)}`} className={className} />;
  const name = title ?? 'Not integrated';
  return (
    <svg
      className={`is-ehr-link ${className}`}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
    >
      <rect x="12.567" y="4.55422" width="1" height="12" rx="0.5" transform="rotate(30 12.567 4.55422)" />
      <path d="M7.5 6C7.77614 6 8 6.22386 8 6.5C8 6.77614 7.77614 7 7.5 7H6C4.34315 7 3 8.34315 3 10C3 11.6569 4.34315 13 6 13H6.62402L6.0459 14H6C3.79086 14 2 12.2091 2 10C2 7.79086 3.79086 6 6 6H7.5Z" />
      <path d="M14.127 6.00293C16.2773 6.06999 18 7.83335 18 10C18 12.2091 16.2091 14 14 14H12.5C12.2239 14 12 13.7761 12 13.5C12 13.2239 12.2239 13 12.5 13H14C15.6569 13 17 11.6569 17 10C17 8.34315 15.6569 7 14 7H13.5518L14.127 6.00293Z" />
      <path d="M8.06738 10.5H6.5C6.22386 10.5 6 10.2761 6 10C6 9.72386 6.22386 9.5 6.5 9.5H8.64453L8.06738 10.5Z" />
      <path d="M13.5 9.5C13.7761 9.5 14 9.72386 14 10C14 10.2761 13.7761 10.5 13.5 10.5H11.5303L12.1084 9.5H13.5Z" />
    </svg>
  );
};
