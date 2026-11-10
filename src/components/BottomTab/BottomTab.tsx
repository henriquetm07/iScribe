import { Button } from '../Button/Button';
import { BottomTabAlert } from './BottomTabAlert';
import { SendSlider, type BottomTabDevice } from './SendSlider';
import './BottomTab.css';

export type BottomTabContent = 'slide' | 'alert' | 'alert-button';

export interface BottomTabProps {
  /** iPhone or iPad layout */
  device?: BottomTabDevice;
  /** Slide to Send (+ Review) · Alert · Alert + Button */
  content?: BottomTabContent;

  /* ---- Slide to Send ---- */
  /** Text in the slider before sending */
  sendLabel?: string;
  /** Text in the slider once sent */
  sentLabel?: string;
  /** Called when the slider reaches the end */
  onSend?: () => void;
  /** Show the Review button next to the slider (Figma "Review Button" toggle) */
  showReview?: boolean;
  reviewLabel?: string;
  onReview?: () => void;

  /* ---- Alert / Alert + Button ---- */
  /** Alert message */
  alert?: string;
  /** Label of the button under the alert */
  buttonLabel?: string;
  onButtonClick?: () => void;
}

/**
 * Bottom Tab — the bar pinned to the bottom of the screen in the iOS app (Figma "Bottom Tab").
 * Built from existing iScribe components:
 *   Slide to Send → SendSlider (knob = IconButton) + Button (outline, rounded)
 *   Alert         → BottomTabAlert (Icon "alert-flat")
 *   Alert + Button→ BottomTabAlert + Button (secondary, rounded)
 */
export const BottomTab = ({
  device = 'iphone',
  content = 'slide',
  sendLabel = 'Send to EHR',
  sentLabel = 'Sent to EHR',
  onSend,
  showReview = true,
  reviewLabel = 'Review',
  onReview,
  alert = 'Patient not checked in',
  buttonLabel = 'Button CTA',
  onButtonClick,
}: BottomTabProps) => {
  const ipad = device === 'ipad';
  return (
    <div className={`is-bottom-tab is-bottom-tab--${device} is-bottom-tab--${content}`}>
      {content === 'slide' ? (
        <div className="is-bottom-tab__send">
          <SendSlider device={device} label={sendLabel} sentLabel={sentLabel} onSend={onSend} />
          {showReview && (
            <Button variant="outline" size={ipad ? 'xxl' : 'xl'} rounded onClick={onReview}>
              {reviewLabel}
            </Button>
          )}
        </div>
      ) : (
        <>
          <BottomTabAlert device={device}>{alert}</BottomTabAlert>
          {content === 'alert-button' && (
            <Button variant="secondary" size={ipad ? 'xl' : 'big'} rounded onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
