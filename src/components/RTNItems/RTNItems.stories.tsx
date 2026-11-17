import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BillingCode, RtnItemHeader, rtnTopics, type RtnDevice, type RtnTopic } from './RTNItems';
import { rtnItemSpecComment } from './RTNItems.docs';
import { RtnSample, type RtnSampleState } from './RtnSample';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const deviceLabel: Record<RtnDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

type Args = { device: RtnDevice; topic: RtnTopic; state: RtnSampleState };

const meta = {
  title: 'Components/RTN Items (Today)/RTN Item',
  component: RtnSample,
  args: { device: 'web', topic: 'diagnoses', state: 'filled' },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'], labels: deviceLabel },
    topic: { control: 'select', options: rtnTopics.map((t) => t.value), labels: Object.fromEntries(rtnTopics.map((t) => [t.value, t.label])) },
    state: {
      name: 'filling status',
      control: 'inline-radio',
      options: ['empty', 'filled', 'edit', 'reordering'],
      description: 'empty · filled in · edit (Pro Doc) · reordering (Billing)',
    },
  },
  decorators: [(Story) => <div style={{ width: 355 }}>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: Args }) => `${rtnItemSpecComment(ctx.args)}\n${code}`,
      },
    },
  },
  render: (args) => <RtnSample key={`${args.device}-${args.topic}-${args.state}`} {...args} />,
} satisfies Meta<typeof RtnSample>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One topic card. Pick the device, topic and filling status in Controls; × removes an entry. */
export const Playground: Story = {};

const Column = ({ device }: { device: RtnDevice }) => (
  <div style={{ display: 'grid', gap: 20, width: 355, alignContent: 'start' }}>
    <span style={caption}>{deviceLabel[device]}</span>
    {rtnTopics.map((t) => (
      <div key={t.value} style={{ display: 'grid', gap: 12 }}>
        <RtnSample device={device} topic={t.value} state="empty" />
        <RtnSample device={device} topic={t.value} state="filled" />
        {t.value === 'pro-doc' && <RtnSample device={device} topic="pro-doc" state="edit" />}
        {t.value === 'billing' && <RtnSample device={device} topic="billing" state="reordering" />}
      </div>
    ))}
  </div>
);

/** Every topic and filling status, per device, as laid out in Figma. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ width: 'auto' }}>{Story()}</div>],
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Column device="iphone" />
      <Column device="ipad" />
      <Column device="web" />
    </div>
  ),
};

/** Procedure Documentation: click the text to edit it, then Discard or Save. */
export const Editing: Story = { args: { topic: 'pro-doc', state: 'edit' } };

/** Billing: drag a code by any part of it (or focus it and use the arrow keys) to reorder; Delete removes it. */
export const Reordering: Story = { args: { topic: 'billing', state: 'filled' } };

/** RTN Item Header (Today), Counter Label and Billing Code on their own. */
export const Parts: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const Demo = () => {
      const [n, setN] = useState(0);
      return (
        <div style={{ display: 'grid', gap: 16 }}>
          <span style={caption}>RTN Item Header (Today) · iPhone / iPad — + adds to the counter</span>
          <RtnItemHeader device="iphone" topic="macros" count={n} onAdd={() => setN(n + 1)} />
          <RtnItemHeader device="ipad" topic="macros" count={n} onAdd={() => setN(n + 1)} />
          <span style={caption}>Billing Code · iPhone / iPad</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <BillingCode device="iphone" code="J06.9" />
            <BillingCode device="ipad" code="J06.9" />
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};
