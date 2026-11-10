import type { SVGProps } from 'react';
import { icons, type IconName } from './icons';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Which icon to draw. See Foundations / Icons for the full set. */
  name: IconName;
  /** Width and height in px (or any CSS length). Defaults to 1em, so it follows the font size. */
  size?: number | string;
  /** Accessible name. Leave empty for decorative icons (hidden from screen readers). */
  title?: string;
}

/** An iScribe icon. Colored with `currentColor`, so it takes the text color around it. */
export const Icon = ({ name, size = '1em', title, ...rest }: IconProps) => {
  const icon = icons[name];
  const s = icon.size;
  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      width={size}
      height={size}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      <g transform={'transform' in icon ? icon.transform : undefined}>
        {icon.paths.map(([d, evenOdd], i) => (
          <path key={i} d={d} fillRule={evenOdd ? 'evenodd' : undefined} clipRule={evenOdd ? 'evenodd' : undefined} />
        ))}
      </g>
    </svg>
  );
};
