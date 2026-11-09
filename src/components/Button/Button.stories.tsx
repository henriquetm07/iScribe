import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { onClick: fn(), children: 'Save note' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };

export const Ghost: Story = { args: { variant: 'ghost', children: 'Add tag' } };

export const Danger: Story = { args: { variant: 'danger', children: 'Delete note' } };

export const Disabled: Story = { args: { disabled: true } };
