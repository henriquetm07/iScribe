/** Human-readable reference for the Popup Message, shown in "Show code". Mirrors PopupMessage.css. */
import { asComment } from '../Button/Button.docs';
import type { PopupMessageDevice, PopupMessageStyle } from './PopupMessage';

const DEVICE: Record<PopupMessageDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

export const popupMessageSpecComment = (style: PopupMessageStyle = 'cta', device: PopupMessageDevice = 'iphone') => {
  const ipad = device === 'ipad';
  return asComment(
    style === 'cta'
      ? [
          `Popup Message · CTA · ${DEVICE[device]}`,
          '',
          '  Card        334px wide, corners 16px, 1px medium-contrast edge, shadow 0 2 10 (15% black), elevated bg',
          `  Header      ${ipad ? 80 : 60}px, super-soft contrast bg, padding 20, gap 8: icon/trash ${ipad ? 22 : 18}px +`,
          `              title Figtree SemiBold ${ipad ? 17 : 16}px / 18, high contrast`,
          `  Content     padding 20, gap 20: message Figtree ${ipad ? 17 : 14}px, medium contrast, centred`,
          `  Buttons     20px apart, each ≤ ${ipad ? 160 : 140}px: Destructive Outline "Delete" · Primary "Cancel"`,
          `              (${ipad ? 'XL, 60px' : 'Regular, 40px'})`,
        ]
      : [
          `Popup Message · Coms · ${DEVICE[device]}`,
          '',
          `  Card        ${device === 'iphone' ? '260px wide, padding 20' : device === 'web' ? '280px wide, padding 40 × 20' : '334 × 200 (min), padding 20, centred'}`,
          '              corners 16px, 1px medium-contrast edge, shadow 0 2 10 (15% black)',
          `  Content     12px apart: icon/alert flat ${ipad ? 22 : 20}px (Status Positive PW) · title Season Mix 20px ·`,
          '              message Figtree 14px, medium contrast, centred',
          `  Close       icon/close 16px, medium contrast, 10px from the top and ${device === 'web' ? 14 : 10}px from the right`,
        ],
  );
};
