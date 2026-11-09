import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { NoteCard } from './NoteCard';

const meta = {
  title: 'Components/NoteCard',
  component: NoteCard,
  args: {
    title: 'Meeting notes — design review',
    excerpt:
      'Agreed to simplify the editor toolbar, move formatting into a floating menu, and test the new note list with five users next week.',
    updatedAt: new Date('2026-11-09T14:30:00'),
    tags: ['design', 'meetings'],
    onSelect: fn(),
  },
} satisfies Meta<typeof NoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const WithoutTags: Story = { args: { tags: [] } };

export const LongExcerpt: Story = {
  args: {
    title: 'Draft: chapter three',
    excerpt:
      'The rain had not stopped for three days. Marta kept the shop open anyway, sorting letters nobody would collect, reading the addresses aloud as if the names might answer back. On the fourth morning a boy came in soaked through, holding an envelope with no stamp.',
    tags: ['writing'],
  },
};
