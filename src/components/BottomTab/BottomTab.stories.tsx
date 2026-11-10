import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { fn } from 'storybook/test';
import { BottomTab, type BottomTabContent, type BottomTabProps } from './BottomTab';
import { bottomTabSpecComment } from './BottomTab.docs';
import type { BottomTabDevice } from './SendSlider';

/** Screen widths used to preview the bar: iPhone 390pt, iPad 820pt. */
const screenWidth: Record<BottomTabDevice, number> = { iphone: 390, ipad: 820 };
const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

/** A simple device screen with the bar pinned to its bottom edge. */
const Screen = ({ device, children, height = 220 }: { device: BottomTabDevice; children: ReactNode; height?: number }) => {
  const style: CSSProperties = {
    width: screenWidth[device],
    maxWidth: '100%',
    height,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'var(--is-background-base-background)',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 0 0 1px var(--is-surface-soft-contrast-background)',
  };
  return <div style={style}>{children}</div>;
};

const meta = {
  title: 'Complex Components/Bottom Tab/Bottom Tab',
  component: BottomTab,
  args: {
    device: 'iphone',
    content: 'slide',
    sendLabel: 'Send to EHR',
    sentLabel: 'Sent to EHR',
    showReview: true,
    reviewLabel: 'Review',
    alert: 'Patient not checked in',
    buttonLabel: 'Button CTA',
    onSend: fn(),
    onReview: fn(),
    onButtonClick: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    content: { control: 'inline-radio', options: ['slide', 'alert', 'alert-button'] },
    sendLabel: { if: { arg: 'content', eq: 'slide' }, table: { category: 'Slide to Send' } },
    sentLabel: { if: { arg: 'content', eq: 'slide' }, table: { category: 'Slide to Send' } },
    showReview: { if: { arg: 'content', eq: 'slide' }, table: { category: 'Slide to Send' } },
    reviewLabel: { if: { arg: 'showReview' }, table: { category: 'Slide to Send' } },
    onSend: { table: { category: 'Slide to Send' } },
    onReview: { table: { category: 'Slide to Send' } },
    alert: { if: { arg: 'content', neq: 'slide' }, table: { category: 'Alert' } },
    buttonLabel: { if: { arg: 'content', eq: 'alert-button' }, table: { category: 'Alert' } },
    onButtonClick: { table: { category: 'Alert' } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        /* "Show code" starts with what the bar is made of: existing components, sizes and Figma variables. */
        transform: (code: string, ctx: { id: string; args: BottomTabProps }) => {
          if (ctx.id.endsWith('--all-variants')) return bottomTabSpecComment({}) + '\n// See each story for the other variants.';
          const jsx = code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*on[A-Z]\w*=\{[^}]*\}\}?/g, '');
          return `${bottomTabSpecComment(ctx.args)}\n${jsx}`;
        },
      },
    },
  },
  render: (args) => (
    <Screen device={args.device ?? 'iphone'}>
      <BottomTab {...args} />
    </Screen>
  ),
} satisfies Meta<typeof BottomTab>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag the blue knob to the end to send. */
export const IPhoneSlideToSend: Story = { name: 'iPhone · Slide to Send' };
export const IPhoneAlert: Story = { name: 'iPhone · Alert', args: { content: 'alert' } };
export const IPhoneAlertButton: Story = { name: 'iPhone · Alert + Button', args: { content: 'alert-button' } };
export const IPadSlideToSend: Story = { name: 'iPad · Slide to Send', args: { device: 'ipad' } };
export const IPadAlert: Story = { name: 'iPad · Alert', args: { device: 'ipad', content: 'alert' } };
export const IPadAlertButton: Story = { name: 'iPad · Alert + Button', args: { device: 'ipad', content: 'alert-button' } };
export const WithoutReview: Story = { name: 'Slide to Send without Review', args: { showReview: false } };

/** Every device and content option — mirrors the Figma component sheet. Switch the toolbar theme to see dark mode. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      {(['iphone', 'ipad'] as BottomTabDevice[]).map((device) => (
        <div key={device} style={{ display: 'grid', gap: 16 }}>
          <div style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>
            {device === 'ipad' ? 'iPad' : 'iPhone'}
          </div>
          {(['slide', 'alert', 'alert-button'] as BottomTabContent[]).map((content) => (
            <div key={content} style={{ display: 'grid', gap: 6 }}>
              <span style={caption}>{{ slide: 'Slide to Send', alert: 'Alert', 'alert-button': 'Alert + Button' }[content]}</span>
              <Screen device={device} height={content === 'slide' ? (device === 'ipad' ? 200 : 140) : 160}>
                <BottomTab {...args} device={device} content={content} />
              </Screen>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
