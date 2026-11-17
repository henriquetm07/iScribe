import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../../icons/Icon';
import { Button } from '../../components/Button/Button';
import { WebApp } from './WebApp';

/** Inside Storybook (the preview frame): offer this page on its own in a new browser tab, full window */
const inStorybookFrame = () => {
  if (new URLSearchParams(window.location.search).get('viewMode') !== 'story') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

const OpenFullWindow = () =>
  inStorybookFrame() ? (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1000 }}>
      <Button
        variant="primary"
        size="regular"
        iconLeft={<Icon name="maximize" />}
        onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
      >
        Open in new tab
      </Button>
    </div>
  ) : null;

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
  render: (args) => (
    <>
      <WebApp key={String(args.defaultCollapsed)} {...args} />
      <OpenFullWindow />
    </>
  ),
} satisfies Meta<typeof WebApp>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Open in new tab" (bottom-right) opens this page on its own, full window, without the Storybook frame.
 *
 * The web app with Sarah Johnson's visit open. Everything works as in its component: pick another appointment in the
 * side bar, collapse it, filter and sort; edit the patient, Start Recording; switch Chart Prep · Previous Note ·
 * Current Note. On the Current Note, + fills a topic; on the Previous Note, + adds an entry and the Check counter
 * adds the whole note — what you add shows on the Current Note as "sections pulled forward".
 */
export const Expanded: Story = {};

/** Side bar collapsed to 180px; the note takes the extra room. */
export const Collapsed: Story = { args: { defaultCollapsed: true } };
