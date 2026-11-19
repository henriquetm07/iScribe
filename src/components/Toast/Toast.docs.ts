/** Human-readable reference for the Toast, shown in "Show code". Mirrors Toast.css. */
import { asComment } from '../Button/Button.docs';
import type { ToastDevice, ToastLayout } from './Toast';

const DEVICE: Record<ToastDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

export const toastSpecComment = (layout: ToastLayout = 'full', device: ToastDevice = 'iphone') => {
  const small = device === 'iphone';
  return asComment(
    layout === 'full'
      ? [
          `Toast · Full width · ${DEVICE[device]}`,
          '',
          `  Card        355 × ${small ? 70 : 80}px, padding 15 × 20, gap 10, corners 20px (Round XXL), elevated background`,
          '  Shadow      Shadow 15: 0 0 20px basic shadow',
          `  Icon        icon/trash ${small ? 16 : 20}px, Status / Foreground Alert`,
          `  Message     Red Hat Text SemiBold ${small ? 13 : 15}px, high contrast; takes the room left`,
          `  Action      Button ghost, ${small ? 'Regular (40px)' : 'Big (50px)'}: "Undo"`,
        ]
      : [
          `Toast · Compact · ${DEVICE[device]}`,
          '',
          `  Pill        hugs its content, ${small ? 'padding 15 × 20 (50px tall)' : '80px tall, padding 15 × 24'}, gap 10, corners ${device === 'web' ? '20px' : 'full round'}`,
          '  Shadow      Shadow 15: 0 0 20px basic shadow',
          `  Icon        icon/check flat ${small ? 20 : 24}px, Status / Foreground Positive`,
          `  Message     Red Hat Text SemiBold ${small ? 13 : 15}px, high contrast`,
        ],
  );
};
