import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectivityDialog } from './ConnectivityDialog';
import { connectivityDialogSpecComment } from './ConnectivityDialog.docs';
import { sampleConnectivity, useSampleConnectivityCheck } from './sampleConnectivity';

const meta = {
  title: 'Components/Connectivity Dialog',
  component: ConnectivityDialog,
  args: { groups: sampleConnectivity },
  argTypes: {
    groups: { control: 'object' },
    title: { control: 'text' },
    note: { control: 'text' },
    checking: { control: 'boolean' },
    onReprocess: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checks every host the app needs, grouped (iScribe Backend, Authentication, …): a spinner while checking, then the response time, or the reason in red when a host can’t be reached. Reprocess checks them all again.',
      },
      source: {
        transform: () => `${connectivityDialogSpecComment()}\n<ConnectivityDialog groups={groups} onReprocess={checkAgain} />`,
      },
    },
  },
  decorators: [(Story) => <div style={{ padding: 30 }}>{Story()}</div>],
} satisfies Meta<typeof ConnectivityDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma sample. Press Reprocess to check again (simulated). */
export const Default: Story = {
  render: function Render(args) {
    const { groups, checking, reprocess } = useSampleConnectivityCheck(args.groups);
    return <ConnectivityDialog {...args} groups={groups} checking={args.checking || checking} onReprocess={reprocess} />;
  },
};

/** Every host being checked */
export const Checking: Story = {
  args: {
    checking: true,
    groups: sampleConnectivity.map((g) => ({ ...g, hosts: g.hosts.map((h) => ({ ...h, status: 'checking' as const })) })),
  },
};
