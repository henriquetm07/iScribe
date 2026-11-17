import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { RtnDevice } from './RTNItems';
import {
  AddFromPreviousButton,
  CheckCounter,
  DateAndProvider,
  PreviousNoteFrame,
  PreviousNoteSectionView,
  PreviousNoteStatusMessage,
  PreviousNoteSummary,
  type PreviousNoteFrameProps,
} from './PreviousNote';
import { samplePreviousNote } from './samplePreviousNote';

const caption = { fontFamily: 'var(--is-font-ui)', fontSize: 12, color: 'var(--is-foreground-low-contrast-primary-foreground)' } as const;
const deviceLabel: Record<RtnDevice, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };
const width: Record<RtnDevice, number> = { iphone: 375, ipad: 700, web: 900 };

const meta = {
  title: 'Components/RTN Notes/RTN Main Frame (Previous Note)',
  component: PreviousNoteFrame,
  args: { device: 'web', state: 'default', ...samplePreviousNote },
  argTypes: {
    device: { control: 'inline-radio', options: ['iphone', 'ipad', 'web'], labels: deviceLabel },
    state: { control: 'inline-radio', options: ['default', 'empty', 'loading', 'error'] },
    sections: { table: { disable: true } },
    added: { table: { disable: true } },
    onAddedChange: { table: { disable: true } },
    onTabChange: { table: { disable: true } },
    onRetry: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args: PreviousNoteFrameProps) => (
    <div style={{ width: width[args.device ?? 'web'], maxWidth: '100%' }}>
      <PreviousNoteFrame key={`${args.device}-${args.state}`} {...args} />
    </div>
  ),
} satisfies Meta<typeof PreviousNoteFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Web. + on an entry adds it to today's note (it turns green with a check); the Check counter next to the date counts
 * what was added and, pressed, adds (or removes) the whole note.
 */
export const Web: Story = {};

/** iPhone: a bottom sheet with a dragger. */
export const IPhone: Story = { name: 'iPhone', args: { device: 'iphone' } };

/** iPad. */
export const IPad: Story = { name: 'iPad', args: { device: 'ipad' } };

/** No previous note: the patient is new to the practice. */
export const Empty: Story = { args: { state: 'empty' } };

/** Loading the previous note. */
export const Loading: Story = { args: { state: 'loading' } };

/** The previous note couldn't be loaded: Retry. */
export const LoadError: Story = { name: 'Error', args: { state: 'error' } };

/** The parts: Check counter, Add From Previous Item, Date and Provider, a section, the summary and the status messages. */
export const Parts: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const Demo = () => {
      const [added, setAdded] = useState<Record<string, boolean>>({});
      const devices: RtnDevice[] = ['iphone', 'ipad', 'web'];
      return (
        <div style={{ display: 'grid', gap: 28, maxWidth: 460 }}>
          <span style={caption}>Check counter · default and with a value (iPhone · iPad · Web)</span>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', paddingTop: 10 }}>
            {devices.map((d) => <CheckCounter key={d} device={d} />)}
            {devices.map((d) => <CheckCounter key={`${d}-v`} device={d} count={12} />)}
          </div>
          <span style={caption}>Add From Previous Item · press to add (iPhone · iPad · Web)</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {devices.map((d) => (
              <AddFromPreviousButton key={d} device={d} added={added[d]} onClick={() => setAdded({ ...added, [d]: !added[d] })} />
            ))}
          </div>
          <span style={caption}>Date and Provider (iPhone · iPad · Web)</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {devices.map((d) => (
              <DateAndProvider key={d} device={d} date="July 30, 2026" visitType="Visit" timeSpan="180 days ago" provider="Dr. Smith" />
            ))}
          </div>
          <span style={caption}>RTN Full Items (Previous Note) · Web</span>
          <PreviousNoteSectionView device="web" section={samplePreviousNote.sections[5]} />
          <span style={caption}>Previous Note Summary · click to expand or collapse (iPhone · iPad)</span>
          <PreviousNoteSummary
            device="iphone"
            sections={samplePreviousNote.sections.slice(0, 3).map((s) => ({ title: s.title, icon: s.icon }))}
          />
          <PreviousNoteSummary
            device="ipad"
            defaultExpanded
            sections={samplePreviousNote.sections.slice(0, 3).map((s) => ({ title: s.title, icon: s.icon }))}
          />
          <span style={caption}>Empty Previous Note · Loading and Error</span>
          <PreviousNoteStatusMessage status="loading" />
          <PreviousNoteStatusMessage status="error" />
        </div>
      );
    };
    return <Demo />;
  },
};
