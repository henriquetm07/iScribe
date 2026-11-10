import { useId } from 'react';

/**
 * The Google Chrome logo (Figma "Chrome icon", 1031:8630), in its own colors.
 * Used by the Web Nav Bar's "Download Chrome Extension" button. 16px by default, artwork inset like Figma.
 */
export const ChromeIcon = ({ size = 16, title }: { size?: number | string; title?: string }) => {
  const clip = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="-1.7778 -1.7778 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g clipPath={`url(#${clip})`}>
        <path
          d="M1.50251 2.16814C4.39505 -1.19806 9.75857 -0.533844 11.7629 3.39858C10.3512 3.39936 8.14158 3.3978 6.94459 3.39858C6.0766 3.39858 5.51582 3.37913 4.90916 3.6988C4.19594 4.07446 3.65694 4.77057 3.4695 5.58879L1.50251 2.16814Z"
          fill="#F44336"
        />
        <path
          d="M4.15239 6.22267C4.15239 7.36367 5.08027 8.29155 6.22048 8.29155C7.3607 8.29155 8.28858 7.36367 8.28858 6.22267C8.28858 5.08168 7.3607 4.1538 6.22048 4.1538C5.07949 4.15302 4.15239 5.08168 4.15239 6.22267Z"
          fill="#2196F3"
        />
        <path
          d="M7.02237 8.93088C5.86193 9.27543 4.50316 8.89355 3.75961 7.60866C3.19184 6.62867 1.69073 4.01457 1.0094 2.82536C-1.37992 6.48712 0.67885 11.4765 5.01571 12.3282L7.02237 8.93088Z"
          fill="#4CAF50"
        />
        <path
          d="M8.14046 4.15302C9.10723 5.05213 9.31801 6.50812 8.66313 7.63667C8.17002 8.48755 6.59503 11.1452 5.83203 12.4316C10.3003 12.707 13.5577 8.32811 12.0861 4.15225L8.14046 4.15302Z"
          fill="#FFC107"
        />
      </g>
      <defs>
        <clipPath id={clip}>
          <rect width="12.4444" height="12.4444" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
