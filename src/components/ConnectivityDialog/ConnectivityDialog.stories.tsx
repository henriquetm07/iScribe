import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { ConnectivityDialog, type ConnectivityGroup } from './ConnectivityDialog';
import { connectivityDialogSpecComment } from './ConnectivityDialog.docs';
import { sampleConnectivity } from './sampleConnectivity';

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

/**
 * A simulated check: Reprocess turns every host to checking, then each one answers after a moment (sample times;
 * the hosts that failed in the sample keep failing)
 */
const useSimulatedCheck = (start: ConnectivityGroup[]) => {
  const [groups, setGroups] = useState(start);
  const [checking, setChecking] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => setGroups(start), [start]);
  const set = (host: string, change: Partial<ConnectivityGroup['hosts'][number]>) =>
    setGroups((gs) => gs.map((g) => ({ ...g, hosts: g.hosts.map((h) => (h.host === host ? { ...h, ...change } : h)) })));
  const reprocess = () => {
    timers.current.forEach(window.clearTimeout);
    const hosts = start.flatMap((g) => g.hosts);
    setGroups(start.map((g) => ({ ...g, hosts: g.hosts.map((h) => ({ ...h, status: 'checking' as const })) })));
    setChecking(true);
    let left = hosts.length;
    timers.current = hosts.map((h) => {
      const ms = 150 + Math.round(Math.random() * 1500);
      return window.setTimeout(() => {
        set(h.host, h.status === 'error' ? { status: 'error' } : { status: 'ok', ms });
        if (--left === 0) setChecking(false);
      }, ms);
    });
  };
  return { groups, checking, reprocess };
};

/** The Figma sample. Press Reprocess to check again (simulated). */
export const Default: Story = {
  render: function Render(args) {
    const { groups, checking, reprocess } = useSimulatedCheck(args.groups);
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
