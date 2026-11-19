import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../../icons/icons';
import { Toast, toastLayouts, type ToastProps } from './Toast';
import { toastSpecComment } from './Toast.docs';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: { device: 'iphone', layout: 'full', onAction: fn() },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    layout: { control: 'inline-radio', options: toastLayouts.map((l) => l.value) },
    icon: { control: 'select', options: iconNames },
    tone: { control: 'inline-radio', options: ['alert', 'positive'] },
    message: { control: 'text' },
    actionLabel: { control: 'text', description: 'Full width only. "" for no action.' },
    onAction: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
    // Full width / Compact dropdown on the canvas, next to the device tabs
    canvasSelect: { arg: 'layout', label: 'Layout', options: toastLayouts },
    docs: {
      description: { component: 'A short confirmation after an action, with an optional action (e.g. Undo).' },
      source: {
        transform: (_code: string, ctx: { args: ToastProps }) => {
          const { layout = 'full', device = 'iphone' } = ctx.args;
          return `${toastSpecComment(layout, device)}\n<Toast device="${device}" layout="${layout}"${layout === 'full' ? ' onAction={undo}' : ''} />`;
        },
      },
    },
  },
  decorators: [(Story) => <div style={{ padding: 30 }}>{Story()}</div>],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full width: "Recording Deleted" with Undo */
export const FullWidth: Story = { name: 'Full width' };

/** Compact: "Sent to EHR" */
export const Compact: Story = { args: { layout: 'compact' } };
