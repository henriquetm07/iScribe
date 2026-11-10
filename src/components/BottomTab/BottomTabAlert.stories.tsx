import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomTabAlert } from './BottomTabAlert';

const meta = {
  title: 'Complex Components/Bottom Tab/Alert',
  component: BottomTabAlert,
  args: { children: 'Patient not checked in', device: 'iphone' },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad'] },
    children: { name: 'message', control: 'text' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        transform: (code: string, ctx: { args: { device?: string } }) => {
          const ipad = ctx.args.device === 'ipad';
          return [
            '/*',
            ` * Bottom Tab Alert · ${ipad ? 'iPad' : 'iPhone'}`,
            ' *',
            ` *   Icon   <Icon name="alert-flat" />, ${ipad ? 22 : 16}px (from Foundations / Icons)`,
            ` *   Text   Figtree Medium ${ipad ? 16 : 15}px, 5px after the icon, centered`,
            ' *   Color  var(--is-foreground-medium-contrast-primary-foreground) for icon and text',
            ' */',
            code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, ''),
          ].join('\n');
        },
      },
    },
  },
} satisfies Meta<typeof BottomTabAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IPhone: Story = { name: 'iPhone' };
export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };
