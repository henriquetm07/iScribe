/**
 * Human-readable reference for the Bottom Tab, shown in the Storybook "Show code" panel.
 * It names the existing iScribe components each part is built from and the Figma variables it uses.
 */
import { asComment } from '../Button/Button.docs';
import type { BottomTabProps } from './BottomTab';
import type { SendSliderProps } from './SendSlider';

const deviceName = (d?: string) => (d === 'ipad' ? 'iPad' : 'iPhone');

export const sendSliderSpecLines = (p: Partial<SendSliderProps>) => {
  const ipad = p.device === 'ipad';
  return [
    `Send Slider · ${deviceName(p.device)}`,
    '',
    'TRACK',
    `  Size        ${ipad ? '320 × 80px' : 'fills the width × 60px'}, padding ${ipad ? 5 : 3}px`,
    '  Background  var(--is-surface-soft-contrast-background)',
    '  Corners     var(--is-full-round) → pill',
    `  Text        "${p.label ?? 'Send to EHR'}" → "${p.sentLabel ?? 'Sent to EHR'}" once sent`,
    `              Figtree Medium ${ipad ? 16 : 15}px, var(--is-foreground-high-contrast-primary-foreground)`,
    '',
    'KNOB → <IconButton rounded icon={<Icon name="arrow-right" />} />',
    `  Size        ${ipad ? '70px, icon 32px' : '54px, icon 24px'} (set on the IconButton by BottomTab.css)`,
    '  Background  var(--is-button-accent)',
    '  Icon        white',
    '',
    'BEHAVIOUR',
    '  While dragging, the text fades with the knob: fully visible at the start, invisible at the end',
    '  Drag the knob to the end (85% or more) and let go → sends, calls onSend, knob stays at the end',
    `  Once sent → "${p.sentLabel ?? 'Sent to EHR'}" fades in to full opacity (220ms)`,
    '              and the knob arrow animates into a check mark (arrow-to-check.json, Lottie, about 2s)',
    '  Let go earlier → knob slides back and the text fades back in (260ms)',
    '  Keyboard: focus the knob and press Enter or Space to send',
  ];
};

export const bottomTabSpecLines = (p: Partial<BottomTabProps>) => {
  const ipad = p.device === 'ipad';
  const content = p.content ?? 'slide';
  const name = { slide: 'Slide to Send', alert: 'Alert', 'alert-button': 'Alert + Button' }[content];
  const padding = {
    slide: ipad ? '40px 10px' : '10px 10px 30px',
    alert: ipad ? '20px 10px' : '10px',
    'alert-button': '20px 10px 30px, 20px gap',
  }[content];
  const lines = [
    `Bottom Tab · ${deviceName(p.device)} · ${name}`,
    '',
    'CONTAINER',
    '  Width       100% of the screen, pinned to the bottom',
    '  Background  var(--is-background-elevated-background)',
    '  Top border  1px var(--is-surface-super-soft-contrast-background)',
    `  Padding     ${padding}`,
    '',
    'BUILT FROM',
  ];
  if (content === 'slide') {
    lines.push(
      `  <SendSlider device="${p.device ?? 'iphone'}" />   ${ipad ? '320px wide' : 'fills the row'} (see Bottom Tab / Send Slider)`,
      p.showReview === false
        ? '  Review button hidden'
        : `  <Button variant="outline" size="${ipad ? 'xxl' : 'xl'}" rounded>${p.reviewLabel ?? 'Review'}</Button>   ${ipad ? '80' : '60'}px, ${ipad ? 20 : 10}px after the slider`,
    );
  } else {
    lines.push(`  <BottomTabAlert device="${p.device ?? 'iphone'}">   <Icon name="alert-flat" /> ${ipad ? '22' : '16'}px + Figtree Medium ${ipad ? 16 : 15}px,`);
    lines.push('              var(--is-foreground-medium-contrast-primary-foreground), centered');
    if (content === 'alert-button')
      lines.push(`  <Button variant="secondary" size="${ipad ? 'xl' : 'big'}" rounded>${p.buttonLabel ?? 'Button CTA'}</Button>   ${ipad ? '60' : '50'}px, centered under the alert`);
  }
  lines.push('', 'Dark mode: every color above switches automatically with data-theme="dark".');
  return lines;
};

export const sendSliderSpecComment = (p: Partial<SendSliderProps>) => asComment(sendSliderSpecLines(p));
export const bottomTabSpecComment = (p: Partial<BottomTabProps>) => asComment(bottomTabSpecLines(p));
