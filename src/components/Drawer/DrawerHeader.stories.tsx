import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../../icons/icons';
import { DrawerHeader, DrawerHeaderTitle, type DrawerDevice, type DrawerHeaderProps } from './DrawerHeader';
import { drawerHeaderSpecComment } from './DrawerHeader.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const devices: DrawerDevice[] = ['iphone', 'ipad', 'web'];
const deviceName: Record<DrawerDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

const meta = {
  title: 'Components/Drawer/Drawer Header',
  component: DrawerHeader,
  args: {
    device: 'iphone',
    icon: 'macros',
    title: 'Add Macros',
    description: 'Search and select macro items to add to the current encounter.',
    closeButton: true,
    search: true,
    searchPlaceholder: 'Search Macros...',
    filter: true,
    filterCount: 12,
    width: 375,
    onClose: fn(),
    onFilter: fn(),
    onSearchChange: fn(),
  },
  argTypes: {
    device: { control: 'inline-radio', options: devices },
    icon: { control: 'select', options: iconNames },
    filterCount: { control: { type: 'number', min: 0, max: 999 } },
    searchValue: { table: { disable: true } },
    onClose: { table: { disable: true } },
    onFilter: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: DrawerHeaderProps }) =>
          `${drawerHeaderSpecComment(ctx.args)}\n${code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*on(Close|Filter|SearchChange)=\{[^}]*\}\}?/g, '')}`,
      },
    },
  },
} satisfies Meta<typeof DrawerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone: Story = { name: 'iPhone' };

export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

export const Web: Story = { args: { device: 'web' } };

/** Figma "Drawer Header Title": the title block on its own (335px wide in Figma) */
export const Title: Story = {
  name: 'Drawer Header Title',
  parameters: { controls: { include: ['device', 'icon', 'title', 'description'] } },
  render: ({ device, icon, title, description }) => (
    <div style={{ width: 335 }}>
      <DrawerHeaderTitle device={device} icon={icon} title={title} description={description} />
    </div>
  ),
};

/** Every device — mirrors the Figma "Drawer - Header" component sheet (Title and Header). */
export const AllDevices: Story = {
  name: 'All devices',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 335px 375px', gap: '20px 24px', alignItems: 'start' }}>
      <span />
      <span style={caption}>Title</span>
      <span style={caption}>Header</span>
      {devices.map((device) => (
        <div key={device} style={{ display: 'contents' }}>
          <span style={{ ...caption, fontWeight: 600, color: 'var(--is-foreground-high-contrast-primary-foreground)' }}>{deviceName[device]}</span>
          <DrawerHeaderTitle device={device} />
          <DrawerHeader device={device} />
        </div>
      ))}
    </div>
  ),
};
