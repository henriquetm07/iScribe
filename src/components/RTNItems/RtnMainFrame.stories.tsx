import type { Meta, StoryObj } from '@storybook/react-vite';
import { RtnMainFrame, rtnTopics, type RtnDevice, type RtnMainFrameProps } from './RTNItems';
import { rtnFrameSpecComment } from './RTNItems.docs';
import { RtnSample, type RtnSampleState } from './RtnSample';

const deviceLabel: Record<RtnDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

type Args = RtnMainFrameProps & { filled: boolean };

const Frame = ({ filled, ...props }: Args) => {
  const device = props.device ?? 'web';
  const state: RtnSampleState = filled ? 'filled' : 'empty';
  const topics = device === 'iphone' ? rtnTopics : rtnTopics.filter((t) => filled || ['macros', 'diagnoses', 'orders'].includes(t.value));
  return (
    <RtnMainFrame {...props}>
      {topics.map((t) => (
        <RtnSample key={`${device}-${t.value}-${state}`} device={device} topic={t.value} state={state} />
      ))}
    </RtnMainFrame>
  );
};

const meta = {
  title: 'Components/RTN Items (Today)/RTN Main Frame',
  component: Frame,
  args: { device: 'web', filled: false, autosaved: true, children: null },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'], labels: deviceLabel },
    filled: { control: 'boolean', description: 'Show the cards filled in' },
    pulledForward: { control: { type: 'number', min: 0 }, description: '"N sections pulled forward" (leave empty to hide)' },
    autosaved: { control: 'boolean' },
    tab: { table: { disable: true } },
    onTabChange: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  decorators: [(Story) => <div style={{ width: 600 }}>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: Args }) => `${rtnFrameSpecComment(ctx.args)}\n${code}`,
      },
    },
  },
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Web: tabs on top, the note's RTN Items below on a soft background, Autosaved at the bottom. */
export const Web: Story = {};

/** Web, filled in, with the "sections pulled forward" line. */
export const Filled: Story = { args: { filled: true, pulledForward: 4 } };

/** iPhone: a bottom sheet with a dragger; every topic, 10px apart. */
export const IPhone: Story = { name: 'iPhone', args: { device: 'iphone' } };

/** iPad. */
export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };
