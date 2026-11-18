import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { Drawer, type DrawerProps } from './Drawer';
import { drawerSpecComment } from './Drawer.docs';
import type { DrawerDevice } from './DrawerHeader';
import { DrawerSample, drawerSampleKinds, drawerSampleOptions, type DrawerSampleKind } from './DrawerSample';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const deviceName: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

/** Screen sizes from Figma (iPhone 376 × 812, iPad 1024 × 1366) and a laptop window for Web, shown smaller to fit */
const SCREEN: Record<DrawerDevice, { w: number; h: number; scale: number; radius: number }> = {
  iphone: { w: 376, h: 812, scale: 0.85, radius: 40 },
  ipad: { w: 1024, h: 1366, scale: 0.5, radius: 36 },
  web: { w: 1280, h: 800, scale: 0.55, radius: 12 },
};

/** A device screen: the page with an "Add …" button, and the drawer opening inside it */
const Screen = ({ device, kind, children, onOpen }: { device: DrawerDevice; kind: DrawerSampleKind; children: ReactNode; onOpen?: () => void }) => {
  const s = SCREEN[device];
  const k = drawerSampleKinds[kind];
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
type StoryArgs = DrawerProps & { content: DrawerSampleKind };

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
    content: { control: 'inline-radio', options: ['macros', 'diagnoses', 'orders'], description: 'Macros, Diagnoses or Orders' },
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
    // Macros / Diagnoses / Orders dropdown on the canvas, next to the device tabs
    canvasSelect: { arg: 'content', label: 'Content', options: drawerSampleOptions },
    docs: {
      source: {
        transform: (_code: string, ctx: { args: StoryArgs }) => {
          const a = ctx.args;
          const k = drawerSampleKinds[a.content ?? 'macros'];
          const d = a.device ?? 'iphone';
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
        <DrawerSample
          key={`${device}-${content}`}
          kind={content}
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

/** Search with matches: "Search Results" */
export const SearchResults: Story = {
  name: 'Search results',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const { content = 'macros', ...props } = args as StoryArgs;
    const device = props.device ?? 'iphone';
    const query = { macros: 'exam', diagnoses: 'right', orders: 'MRI' }[content];
    return (
      <Screen device={device} kind={content} onOpen={() => updateArgs({ open: true })}>
        <DrawerSample key={`${device}-${content}`} kind={content} {...props} contained defaultQuery={query} onClose={() => updateArgs({ open: false })} />
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
        <DrawerSample
          key={`${device}-${content}`}
          kind={content}
          {...props}
          contained
          defaultQuery={{ macros: 'Macro Typing', diagnoses: 'Diagnoses Typing', orders: 'Orders Typing' }[content]}
          onClose={() => updateArgs({ open: false })}
        />
      </Screen>
    );
  },
};

/** Every device — mirrors the Figma "Drawer" sheets. Pick Macros, Diagnoses or Orders on the canvas. */
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
              <DrawerSample key={content} kind={content} device={device} open contained />
            </Screen>
          </div>
        ))}
      </div>
    );
  },
};
