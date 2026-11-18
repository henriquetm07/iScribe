import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { Drawer, type DrawerProps } from './Drawer';
import { drawerSpecComment } from './Drawer.docs';
import type { DrawerDevice } from './DrawerHeader';
import { DrawerSample, drawerSampleKinds, drawerSampleOptions, type DrawerSampleKind, type DrawerSampleProps } from './DrawerSample';
import { PREVIOUS_NOTE_DESCRIPTION, PREVIOUS_NOTE_TITLE, PreviousNoteDrawerSample } from './PreviousNoteDrawerSample';

/** What the drawer shows: Macros, Diagnoses, Orders, or the "Add from Previous Note" checklist */
type DrawerContent = DrawerSampleKind | 'previous';
const contentOptions = [...drawerSampleOptions, { value: 'previous', label: 'Previous Note' }];

/** The page button that opens each kind of drawer */
const opener = (kind: DrawerContent) =>
  kind === 'previous' ? { title: PREVIOUS_NOTE_TITLE, icon: 'previous-note' as const } : drawerSampleKinds[kind];

/** The working drawer for the picked content */
const ContentDrawer = ({ content, ...props }: DrawerSampleProps & { content: DrawerContent }) => {
  if (content !== 'previous') return <DrawerSample kind={content} {...props} />;
  // The checklist has no search or filter
  const { defaultQuery: _q, kind: _k, searchPlaceholder: _p, filter: _f, filterCount: _c, onFilter: _o, search: _s, defaultAdded: _a, added: _d, onAddedChange: _x, items: _i, count: _n, description, ...rest } = props;
  // An empty description from Controls keeps the checklist's own line
  return <PreviousNoteDrawerSample {...rest} description={description || undefined} />;
};

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const deviceName: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

/** Screen sizes from Figma (iPhone 376 × 812, iPad 1024 × 1366) and a laptop window for Web, shown smaller to fit */
const SCREEN: Record<DrawerDevice, { w: number; h: number; scale: number; radius: number }> = {
  iphone: { w: 376, h: 812, scale: 0.85, radius: 40 },
  ipad: { w: 1024, h: 1366, scale: 0.5, radius: 36 },
  web: { w: 1280, h: 800, scale: 0.55, radius: 12 },
};

/** A device screen: the page with an "Add …" button, and the drawer opening inside it */
const Screen = ({ device, kind, children, onOpen }: { device: DrawerDevice; kind: DrawerContent; children: ReactNode; onOpen?: () => void }) => {
  const s = SCREEN[device];
  const k = opener(kind);
  return (
    <div style={{ width: s.w * s.scale, height: s.h * s.scale, flex: 'none' }}>
      <div
        style={{
          position: 'relative',
          width: s.w,
          height: s.h,
          transform: `scale(${s.scale})`,
          transformOrigin: '0 0',
          overflow: 'hidden',
          borderRadius: s.radius,
          border: '1px solid var(--is-surface-soft-contrast-background)',
          background: 'var(--is-background-base-background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button variant="secondary" size={device === 'ipad' ? 'xl' : 'regular'} iconLeft={<Icon name={k.icon} />} onClick={onOpen}>
          {k.title}
        </Button>
        {children}
      </div>
    </div>
  );
};

/** Story args: the Drawer's props, plus which content it shows (picked with the dropdown on the canvas) */
type StoryArgs = DrawerProps & { content: DrawerContent };

const meta = {
  title: 'Components/Drawer/Drawer',
  component: Drawer,
  args: {
    content: 'macros',
    device: 'iphone',
    open: true,
    description: '',
    search: true,
    closeButton: true,
    onClose: fn(),
    onFilter: fn(),
  },
  argTypes: {
    content: { control: 'inline-radio', options: ['macros', 'diagnoses', 'orders', 'previous'], description: 'Macros, Diagnoses, Orders or Previous Note (Add from Previous Note checklist)' },
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
    icon: { control: 'select', options: ['macros', 'diagnosis', 'order'], description: 'Icon before the title (default: the content’s)' },
    title: { control: 'text', description: 'Title (default: “Add Macros”, “Add Diagnoses” or “Add Orders”)' },
    searchPlaceholder: { control: 'text' },
    filter: { control: 'boolean', description: 'Filter button next to the search field (default: off)' },
    filterCount: { control: { type: 'number', min: 0, max: 999 } },
    open: { description: 'Shown or hidden. It slides in and out.' },
    children: { table: { disable: true } },
    contained: { table: { disable: true } },
    searchValue: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
    onClose: { table: { disable: true } },
    onFilter: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
    // Macros / Diagnoses / Orders / Previous Note dropdown on the canvas, next to the device tabs
    canvasSelect: { arg: 'content', label: 'Content', options: contentOptions },
    docs: {
      source: {
        transform: (_code: string, ctx: { args: StoryArgs }) => {
          const a = ctx.args;
          const d = a.device ?? 'iphone';
          if (a.content === 'previous')
            return `${drawerSpecComment(a)}
<Drawer
  device="${d}"
  open={${a.open ?? false}}
  onClose={() => setOpen(false)}
  icon="${a.icon ?? 'macros'}"
  title="${a.title ?? PREVIOUS_NOTE_TITLE}"
  description="${a.description || PREVIOUS_NOTE_DESCRIPTION}"
  count={added.length}
  search={false}
  filter={false}
>
  <DrawerList>
    <DrawerChecklistItem device="${d}" icon="history" name="History of Present Illness" added onToggle={…} />
    <DrawerChecklistItem device="${d}" icon="exam" name="Physical Examination" onToggle={…} />
    <DrawerChecklistItem device="${d}" label="I10" name="Hypertension, essential" onToggle={…} />
    <DrawerChecklistItem device="${d}" label="99870" labelTone="accent" name="Periodic comprehensive preventive medicine" onToggle={…} />
  </DrawerList>
</Drawer>`;
          const k = drawerSampleKinds[a.content ?? 'macros'];
          const filter = a.filter ?? k.filter;
          const item =
            a.content === 'macros' || !a.content
              ? (added: boolean) =>
                  `<DrawerMacroListItem device="${d}" name="${k.items[added ? 0 : 1].name}"${added ? ' added' : ` section="${k.items[1].label}" source="Athena"`} onToggle={…} />`
              : (added: boolean) => `<DrawerDiagnosesListItem device="${d}" name="${k.items[added ? 0 : 1].name}" label="${k.items[added ? 0 : 1].label}"${added ? ' added' : ''} onToggle={…} />`;
          return `${drawerSpecComment(a)}
<Drawer
  device="${d}"
  open={${a.open ?? false}}
  onClose={() => setOpen(false)}
  icon="${a.icon ?? k.icon}"
  title="${a.title ?? k.title}"
  searchPlaceholder="${a.searchPlaceholder ?? k.placeholder}"
  searchValue={query}
  onSearchChange={setQuery}
${filter ? (a.filterCount ? `  filterCount={${a.filterCount}}\n` : '') : '  filter={false}\n'}>
  <DrawerList>
    <DrawerListTitle device="${d}">Added ${k.noun}</DrawerListTitle>
    ${item(true)}
    <DrawerListTitle device="${d}">All ${k.noun}</DrawerListTitle>
    ${item(false)}
  </DrawerList>
</Drawer>`;
        },
      },
    },
  },
  /* Inside a device screen. The button behind it opens it again after closing. */
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const { content = 'macros', ...props } = args as StoryArgs;
    const device = props.device ?? 'iphone';
    return (
      <Screen device={device} kind={content} onOpen={() => updateArgs({ open: true })}>
        <ContentDrawer
          key={`${device}-${content}`}
          content={content}
          {...props}
          contained
          onClose={() => {
            props.onClose?.();
            updateArgs({ open: false });
          }}
        />
      </Screen>
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

export const Web: Story = { args: { device: 'web' } };

/** Search with matches: "Search Results" (Previous Note has no search, so it shows the checklist) */
export const SearchResults: Story = {
  name: 'Search results',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const { content = 'macros', ...props } = args as StoryArgs;
    const device = props.device ?? 'iphone';
    const query = { macros: 'exam', diagnoses: 'right', orders: 'MRI', previous: undefined }[content];
    return (
      <Screen device={device} kind={content} onOpen={() => updateArgs({ open: true })}>
        <ContentDrawer key={`${device}-${content}`} content={content} {...props} contained defaultQuery={query} onClose={() => updateArgs({ open: false })} />
      </Screen>
    );
  },
};

/** Search with no match: "No results" */
export const NoResults: Story = {
  name: 'No results',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const { content = 'macros', ...props } = args as StoryArgs;
    const device = props.device ?? 'iphone';
    return (
      <Screen device={device} kind={content} onOpen={() => updateArgs({ open: true })}>
        <ContentDrawer
          key={`${device}-${content}`}
          content={content}
          {...props}
          contained
          defaultQuery={{ macros: 'Macro Typing', diagnoses: 'Diagnoses Typing', orders: 'Orders Typing', previous: undefined }[content]}
          onClose={() => updateArgs({ open: false })}
        />
      </Screen>
    );
  },
};

/** Every device — mirrors the Figma "Drawer" sheets. Pick Macros, Diagnoses, Orders or Previous Note on the canvas. */
export const AllDevices: Story = {
  name: 'All devices',
  parameters: { controls: { disable: true } },
  render: (args) => {
    const content = (args as StoryArgs).content ?? 'macros';
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 32 }}>
        {(['iphone', 'ipad', 'web'] as DrawerDevice[]).map((device) => (
          <div key={device} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>{deviceName[device]}</span>
            <Screen device={device} kind={content}>
              <ContentDrawer key={content} content={content} device={device} open contained />
            </Screen>
          </div>
        ))}
      </div>
    );
  },
};
