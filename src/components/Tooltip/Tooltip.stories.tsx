import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip, WithTooltip, type TooltipProps, type TooltipTip } from './Tooltip';
import { tooltipSpecComment } from './Tooltip.docs';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const TEXT = "Just say the patient's demographics during your recording. We'll fill these fields in automatically.";

const meta = {
  title: 'Components/Tooltip - Web',
  component: Tooltip,
  args: {
    tone: 'periwinkle',
    tip: 'right',
    title: "Say it, don't type it",
    children: TEXT,
    onClose: fn(),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['periwinkle', 'white'] },
    tip: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left', 'none'] },
    title: { control: 'text' },
    children: { name: 'text', control: 'text' },
    width: { control: 'text' },
    onClose: { table: { disable: true } },
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, ctx: { args: TooltipProps }) =>
          `${tooltipSpecComment(ctx.args)}\n${code.replace(/^(\s*\/\*[\s\S]*?\*\/\s*)+/, '').replace(/\n\s*onClose=\{[^}]*\}\}?/g, '\n  onClose={() => setOpen(false)}')}`,
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Periwinkle callout: title, text and ×, with the tip on one side */
export const Periwinkle: Story = {};

/** White label */
export const White: Story = {
  args: { tone: 'white', tip: 'none', title: undefined, children: 'Tooltip', onClose: undefined },
};

/** Hover or focus the buttons: WithTooltip shows the tooltip next to them */
export const OnHover: Story = {
  name: 'On hover',
  parameters: { controls: { disable: true }, docs: { source: { code: '<WithTooltip content="Microphone settings" placement="top">\n  <IconButton … />\n</WithTooltip>' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'center', padding: '100px 220px' }}>
      <WithTooltip content="Microphone settings" placement="top">
        <IconButton variant="secondary" size="regular" icon={<Icon name="mic" />} label="Microphone settings" />
      </WithTooltip>
      <WithTooltip content="Filters" placement="bottom">
        <IconButton variant="secondary" size="regular" icon={<Icon name="filter" />} label="Filters" />
      </WithTooltip>
      <WithTooltip tone="periwinkle" title="Say it, don't type it" content={TEXT} placement="right">
        <Button variant="primary" size="regular">
          Start Recording
        </Button>
      </WithTooltip>
    </div>
  ),
};

/** Every variant — mirrors the Figma "Tooltip" sheet */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '28px 32px', alignItems: 'center', padding: 16 }}>
      {(['right', 'top', 'left', 'bottom'] as TooltipTip[]).map((tip) => (
        <div key={tip} style={{ display: 'contents' }}>
          <span style={caption}>Periwinkle · tip {tip}</span>
          <Tooltip tip={tip} title="Say it, don't type it" onClose={() => {}}>
            {TEXT}
          </Tooltip>
        </div>
      ))}
      <span style={caption}>White</span>
      <Tooltip tone="white">Tooltip</Tooltip>
    </div>
  ),
};
