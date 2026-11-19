import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { WebNoteBottomBar, webNoteBottomBarLabels, webNoteBottomBarSteps, type WebNoteBottomBarAction, type WebNoteBottomBarProps } from './WebNoteBottomBar';
import { webNoteBottomBarSpecComment } from './WebNoteBottomBar.docs';

const meta = {
  title: 'Components/Web Note Bottom Bar',
  component: WebNoteBottomBar,
  args: { action: 'generate-note', onAction: fn(), disabled: false },
  argTypes: {
    action: { control: 'inline-radio', options: webNoteBottomBarSteps, labels: webNoteBottomBarLabels },
    doneAt: { control: 'date', description: 'Send to EHR / Mark as Complete done at this time: ghost, blocked button' },
    label: { control: 'text' },
    className: { table: { disable: true } },
  },
  decorators: [(Story) => <div style={{ width: 1020, maxWidth: '100%', boxShadow: '0 0 0 1px var(--is-surface-soft-contrast-background)' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: { component: 'The bar under the note (web only), with its next step: Generate Note, Mark as Complete or Send to EHR.' },
      source: {
        transform: (_code: string, ctx: { args: WebNoteBottomBarProps }) =>
          `${webNoteBottomBarSpecComment(ctx.args.action)}\n<WebNoteBottomBar action="${ctx.args.action ?? 'generate-note'}" onAction={handleAction} />`,
      },
    },
  },
} satisfies Meta<typeof WebNoteBottomBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GenerateNote: Story = { name: 'Generate Note' };
export const MarkAsComplete: Story = { name: 'Mark as Complete', args: { action: 'mark-as-complete' } };
export const SendToEhr: Story = { name: 'Send to EHR', args: { action: 'send-to-ehr' } };

/** Done: after Send to EHR, a ghost blocked button with the time */
export const SentToEhr: Story = { name: 'Sent to EHR', args: { action: 'send-to-ehr', doneAt: new Date(2026, 10, 19, 14, 51) } };

/** Done: after Mark as Complete */
export const MarkedAsComplete: Story = { name: 'Marked as Complete', args: { action: 'mark-as-complete', doneAt: new Date(2026, 10, 19, 14, 51) } };

/** Click through the steps: Generate Note → Mark as Complete → Send to EHR → Sent to EHR at … */
export const Steps: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [step, setStep] = useState<WebNoteBottomBarAction>('generate-note');
    const [doneAt, setDoneAt] = useState<Date>();
    const next = () => (step === 'send-to-ehr' ? setDoneAt(new Date()) : setStep(webNoteBottomBarSteps[webNoteBottomBarSteps.indexOf(step) + 1]));
    return <WebNoteBottomBar action={step} onAction={next} doneAt={doneAt} />;
  },
};
