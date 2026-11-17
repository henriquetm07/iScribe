import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebApp } from './WebApp';

const meta = {
  title: 'Pages/Web App',
  component: WebApp,
  args: { defaultCollapsed: false, defaultSelectedId: '6' },
  argTypes: {
    defaultCollapsed: { name: 'side bar collapsed', control: 'boolean' },
    defaultSelectedId: { table: { disable: true } },
    visitDate: { table: { disable: true } },
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <WebApp key={String(args.defaultCollapsed)} {...args} />,
} satisfies Meta<typeof WebApp>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The web app with Sarah Johnson's visit open. Everything works as in its component: pick another appointment in the
 * side bar, collapse it, filter and sort; edit the patient, Start Recording; switch Chart Prep · Previous Note ·
 * Current Note. On the Current Note, + fills a topic; on the Previous Note, + adds an entry and the Check counter
 * adds the whole note — what you add shows on the Current Note as "sections pulled forward".
 */
export const Expanded: Story = {};

/** Side bar collapsed to 180px; the note takes the extra room. */
export const Collapsed: Story = { args: { defaultCollapsed: true } };
