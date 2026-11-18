import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { Drawer, type DrawerProps } from './Drawer';
import { drawerSpecComment } from './Drawer.docs';
import type { DrawerDevice } from './DrawerHeader';
import { MacroDrawerSample } from './MacroDrawerSample';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const deviceName: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

/** Screen sizes from Figma (iPhone 376 × 812, iPad 1024 × 1366) and a laptop window for Web, shown smaller to fit */
const SCREEN: Record<DrawerDevice, { w: number; h: number; scale: number; radius: number }> = {
  iphone: { w: 376, h: 812, scale: 0.85, radius: 40 },
  ipad: { w: 1024, h: 1366, scale: 0.5, radius: 36 },
  web: { w: 1280, h: 800, scale: 0.55, radius: 12 },
};

/** A device screen: the page with an "Add Macros" button, and the drawer opening inside it */
const Screen = ({ device, children, onOpen }: { device: DrawerDevice; children: ReactNode; onOpen?: () => void }) => {
  const s = SCREEN[device];
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
        <Button variant="secondary" size={device === 'ipad' ? 'xl' : 'regular'} iconLeft={<Icon name="macros" />} onClick={onOpen}>
          Add Macros
        </Button>
        {children}
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/Drawer/Drawer',
  component: Drawer,
  args: {
    device: 'iphone',
    open: true,
    icon: 'macros',
    title: 'Add Macros',
    description: '',
    search: true,
    searchPlaceholder: 'Search Macros...',
    filter: true,
    filterCount: 12,
    closeButton: true,
    onClose: fn(),
    onFilter: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'] },
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
    docs: {
      source: {
        transform: (_code: string, ctx: { args: DrawerProps }) => {
          const a = ctx.args;
          return `${drawerSpecComment(a)}
<Drawer
  device="${a.device ?? 'iphone'}"
  open={${a.open ?? false}}
  onClose={() => setOpen(false)}
  icon="${a.icon ?? 'macros'}"
  title="${a.title ?? 'Add Macros'}"
  searchPlaceholder="${a.searchPlaceholder ?? 'Search Macros...'}"
  searchValue={query}
  onSearchChange={setQuery}
  filterCount={${a.filterCount ?? 0}}
>
  <DrawerList>
    <DrawerListTitle device="${a.device ?? 'iphone'}">Added Macros</DrawerListTitle>
    <DrawerMacroListItem device="${a.device ?? 'iphone'}" name="Insert normal shoulder exam" added onToggle={…} />
    <DrawerListTitle device="${a.device ?? 'iphone'}">All Macros</DrawerListTitle>
    <DrawerMacroListItem device="${a.device ?? 'iphone'}" name="Physical examination: within normal limits" section="PE" source="Athena" onToggle={…} />
  </DrawerList>
</Drawer>`;
        },
      },
    },
  },
  /* Inside a device screen. "Add Macros" opens it again after closing. */
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const device = args.device ?? 'iphone';
    return (
      <Screen device={device} onOpen={() => updateArgs({ open: true })}>
        <MacroDrawerSample
          key={device}
          {...args}
          contained
          onClose={() => {
            args.onClose?.();
            updateArgs({ open: false });
          }}
        />
      </Screen>
    );
  },
} satisfies Meta<typeof Drawer>;

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
    const device = args.device ?? 'iphone';
    return (
      <Screen device={device} onOpen={() => updateArgs({ open: true })}>
        <MacroDrawerSample key={device} {...args} contained defaultQuery="exam" onClose={() => updateArgs({ open: false })} />
      </Screen>
    );
  },
};

/** Search with no match: "No results" */
export const NoResults: Story = {
  name: 'No results',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const device = args.device ?? 'iphone';
    return (
      <Screen device={device} onOpen={() => updateArgs({ open: true })}>
        <MacroDrawerSample key={device} {...args} contained defaultQuery="Macro Typing" onClose={() => updateArgs({ open: false })} />
      </Screen>
    );
  },
};

/** Every device — mirrors the Figma "Drawer List Modal" sheet */
export const AllDevices: Story = {
  name: 'All devices',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 32 }}>
      {(['iphone', 'ipad', 'web'] as DrawerDevice[]).map((device) => (
        <div key={device} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>{deviceName[device]}</span>
          <Screen device={device}>
            <MacroDrawerSample device={device} open contained filterCount={12} />
          </Screen>
        </div>
      ))}
    </div>
  ),
};
