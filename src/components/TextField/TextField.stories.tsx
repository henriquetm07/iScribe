import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Note title', placeholder: 'Untitled note' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Shown at the top of the note list.' } };

export const WithError: Story = { args: { error: 'A title is required.', defaultValue: '' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Archived note' } };
