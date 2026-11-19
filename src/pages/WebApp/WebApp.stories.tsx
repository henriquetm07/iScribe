import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../../components/Button/Button';
import { WebApp } from './WebApp';

/** Where this page is being shown: the story canvas inside Storybook, a docs page, or on its own (full window) */
const where = (): 'canvas' | 'docs' | 'standalone' => {
  if (new URLSearchParams(window.location.search).get('viewMode') === 'docs') return 'docs';
  try {
    return window.self !== window.top ? 'canvas' : 'standalone';
  } catch {
    return 'canvas';
  }
};

/** The story on its own, full window (no Storybook sidebar or panels) */
const standaloneUrl = (storyId: string) => {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.pathname = url.pathname.replace(/[^/]*$/, 'iframe.html');
  url.searchParams.set('id', storyId);
  url.searchParams.set('viewMode', 'story');
  return url.toString();
};

const OpenButton = ({ storyId }: { storyId: string }) => (
  <Button
    variant="primary"
    size="regular"
    iconLeft={<Icon name="maximize" />}
    onClick={() => window.open(standaloneUrl(storyId), '_blank', 'noopener,noreferrer')}
  >
    Open in new tab
  </Button>
);

/**
 * "Open in new tab": floating bottom-right on the story canvas, in a bar above the page on the docs page, and hidden
 * once the page is open on its own.
 */
const OpenFullWindow = ({ storyId, children }: { storyId: string; children: ReactNode }) => {
  const mode = where();
  if (mode === 'docs') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 12px' }}>
          <OpenButton storyId={storyId} />
        </div>
        <div className="is-webapp-docs-frame">{children}</div>
      </div>
    );
  }
  return (
    <>
      {children}
      {mode === 'canvas' && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1000 }}>
          <OpenButton storyId={storyId} />
        </div>
      )}
    </>
  );
};

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
  render: (args, context) => (
    <OpenFullWindow storyId={context.id}>
      <WebApp key={String(args.defaultCollapsed)} {...args} />
    </OpenFullWindow>
  ),
} satisfies Meta<typeof WebApp>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Open in new tab" (bottom-right, or above the page on this docs page) opens it on its own, full window, without the Storybook frame.
 *
 * The web app with Sarah Johnson's visit open. Everything works as in its component: pick another appointment in the
 * side bar, collapse it, filter and sort; edit the patient, Start Recording; switch Chart Prep · Previous Note ·
 * Current Note. On the Current Note, + fills a topic; on the Previous Note, + adds an entry and the Check counter
 * adds the whole note — what you add shows on the Current Note as "sections pulled forward".
 *
 * New Note (top left) opens an empty note at the current time: its card in the side bar shows placeholders and
 * "New Note" until the demographics are filled in, a recording starts or something is added to the note; then it
 * becomes "Note in Progress". A new note left untouched is erased when you open another note.
 *
 * Sarah Johnson starts Checked In. Appointments already Sent to EHR or Copied to EHR open on their finished note: the
 * generated note, the recording ready to play back but locked, and "Sent to EHR at …" / "Marked as Complete at …".
 */
export const Expanded: Story = {};

/** Side bar collapsed to 180px; the note takes the extra room. */
export const Collapsed: Story = { args: { defaultCollapsed: true } };
