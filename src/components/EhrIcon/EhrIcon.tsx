import { useId } from 'react';
import { Icon } from '../../icons/Icon';
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
    // Figma "icon/link broken"
    <Icon name="link-broken" size={size} title={name || undefined} className={`is-ehr-link ${className}`} />
  );
};
