import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { AppointmentStatus, AppointmentStatusIcon, appointmentStatuses, type AppointmentStatusProps } from './AppointmentStatus';
import { appointmentStatusSpecComment } from './AppointmentStatus.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;

const meta = {
  title: 'Components/Appointment Status',
  component: AppointmentStatus,
  args: { status: 'new-note' },
  argTypes: {
    status: { table: { disable: true } },
    label: { table: { disable: true } },
    animate: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: { component: 'Patient and note statuses' },
      controls: false,
      // The first story is the canvas at the top; not listed again below
      primaryInStories: false,
      source: {
        transform: (code: string, ctx: { args: AppointmentStatusProps }) => `${appointmentStatusSpecComment(ctx.args.status)}\n${code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '')}`,
      },
    },
  },
} satisfies Meta<typeof AppointmentStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The icon with its label. Pick a status in the dropdown. */
export const Default: Story = {
  parameters: {
    // The status dropdown on the canvas (as on Toast); no control panel
    canvasSelect: { arg: 'status', label: 'Status', options: appointmentStatuses, width: 190 },
    docs: {
      source: {
        transform: (_code: string, ctx: { args: AppointmentStatusProps }) =>
          `${appointmentStatusSpecComment(ctx.args.status)}\n<AppointmentStatus status="${ctx.args.status}" />`,
      },
    },
  },
  // Room under the dropdown for its open list (8 statuses), so the canvas doesn't cut it off
  decorators: [(Story) => <div style={{ display: 'flex', justifyContent: 'center', minHeight: 320 }}>{Story()}</div>],
};

/** Just the 20px icon (Figma "Appointment Status Icons"). */
export const Icon: Story = {
  parameters: {
    docs: {
      source: {
        transform: (_code: string, ctx: { args: AppointmentStatusProps }) =>
          `${appointmentStatusSpecComment(ctx.args.status, false)}\n<AppointmentStatusIcon status="${ctx.args.status}" />`,
      },
    },
  },
  render: ({ status }) => <AppointmentStatusIcon status={status} />,
};

/** Sending a note: when the status changes to Sent to EHR, the paper plane flies off and back in once. */
export const SendToEhr: Story = {
  name: 'Send to EHR',
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [sent, setSent] = useState(false);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <AppointmentStatus status={sent ? 'sent-to-ehr' : 'note-in-progress'} />
        <Button size="small" variant="secondary" onClick={() => setSent((s) => !s)}>
          {sent ? 'Reset' : 'Send to EHR'}
        </Button>
      </div>
    );
  },
};

/** Copying a note: when the status changes to Copied to EHR, the squares pull apart and swap once. */
export const CopyToEhr: Story = {
  name: 'Copy to EHR',
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [copied, setCopied] = useState(false);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <AppointmentStatus status={copied ? 'copied-to-ehr' : 'note-in-progress'} />
        <Button size="small" variant="secondary" onClick={() => setCopied((c) => !c)}>
          {copied ? 'Reset' : 'Copy to EHR'}
        </Button>
      </div>
    );
  },
};

/** Every status, as in the Figma sheet: the icons on their own, and with their labels. */
export const AllStatuses: Story = {
  name: 'All statuses',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '20px 24px', alignItems: 'center', justifyItems: 'start' }}>
      <span />
      <span style={caption}>Icon</span>
      <span style={caption}>Icon + label</span>
      {appointmentStatuses.map(({ value, label }) => (
        <div key={value} style={{ display: 'contents' }}>
          <span style={{ ...caption, justifySelf: 'end' }}>{label}</span>
          <AppointmentStatusIcon status={value} />
          <AppointmentStatus status={value} />
        </div>
      ))}
    </div>
  ),
};
