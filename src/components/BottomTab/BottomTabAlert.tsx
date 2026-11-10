import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import type { BottomTabDevice } from './SendSlider';
import './BottomTab.css';

export interface BottomTabAlertProps {
  /** The message, e.g. "Patient not checked in" */
  children: ReactNode;
  /** iPhone: 15px text, 16px icon · iPad: 16px text, 22px icon */
  device?: BottomTabDevice;
}

/** "Alert" from the Figma Bottom Tab page: the alert-flat icon from Foundations / Icons and a short message, centered. */
export const BottomTabAlert = ({ children, device = 'iphone' }: BottomTabAlertProps) => (
  <p className={`is-bottom-tab-alert is-bottom-tab-alert--${device}`} role="status">
    <Icon name="alert-flat" className="is-bottom-tab-alert__icon" />
    <span>{children}</span>
  </p>
);
