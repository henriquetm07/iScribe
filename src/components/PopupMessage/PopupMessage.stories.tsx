import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PopupMessage, type PopupMessageProps } from './PopupMessage';
import { popupMessageSpecComment } from './PopupMessage.docs';

const styles = [
  { value: 'cta', label: 'CTA' },
  { value: 'coms', label: 'Coms' },
];

const meta = {
  title: 'Components/Popup Message',
  component: PopupMessage,
  args: { device: 'iphone', contentStyle: 'cta', onMain: fn(), onSecondary: fn(), onClose: fn() },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    contentStyle: { control: 'inline-radio', options: ['cta', 'coms'], labels: { cta: 'CTA', coms: 'Coms' } },
    title: { control: 'text' },
    message: { control: 'text' },
    mainButton: { control: 'text', description: 'CTA: the Primary button\'s label ("" or false hides it)' },
    secondaryButton: { control: 'text', description: 'CTA: the Destructive Outline button\'s label ("" or false hides it)' },
    icon: { control: 'text' },
    onMain: { table: { disable: true } },
    onSecondary: { table: { disable: true } },
    onClose: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
    // CTA / Coms dropdown on the canvas, next to the device tabs
    canvasSelect: { arg: 'contentStyle', label: 'Content Style', options: styles },
    docs: {
      description: {
        component:
          'A small dialog in the middle of the screen. CTA asks to confirm an action (e.g. deleting the recording) with two buttons; Coms tells something (e.g. a failed payment) with a × to close.',
      },
      source: {
        transform: (_code: string, ctx: { args: PopupMessageProps }) => {
          const { contentStyle = 'cta', device = 'iphone' } = ctx.args;
          return `${popupMessageSpecComment(contentStyle, device)}\n<PopupMessage device="${device}" contentStyle="${contentStyle}"${
            contentStyle === 'cta' ? ' onSecondary={deleteRecording} onMain={cancel}' : ' onClose={close}'
          } />`;
        },
      },
    },
  },
  decorators: [(Story) => <div style={{ padding: 30 }}>{Story()}</div>],
} satisfies Meta<typeof PopupMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** CTA: "Delete your recording?" with Delete · Cancel */
export const CTA: Story = {};

/** Coms: "Payment Failed", closed with × */
export const Coms: Story = { args: { contentStyle: 'coms' } };
