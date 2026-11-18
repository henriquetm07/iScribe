import type { ArgTypesEnhancer, Decorator, StrictArgTypes } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Tabs } from '../src/components/Tabs/Tabs';

/*
 * Device selector on the canvas.
 * Every story with a "device" arg (iPhone · iPad · Web) shows the Tabs component above the canvas to switch it,
 * instead of a radio in the Controls table. Stories that show every device at once (controls disabled), that
 * leave "device" out of their controls, or that set parameters.deviceSelector = false keep no selector.
 */

const DEVICES = ['iphone', 'ipad', 'web'];
const LABELS: Record<string, string> = { iphone: 'iPhone', ipad: 'iPad', web: 'Web' };

interface Ctx {
  parameters: Record<string, any>;
  argTypes: StrictArgTypes | Record<string, any>;
}

/** The devices to offer for this story, or null when it gets no selector */
const deviceOptions = ({ parameters, argTypes }: Ctx): string[] | null => {
  if (parameters.deviceSelector === false) return null;
  const controls = parameters.controls ?? {};
  if (controls.disable) return null;
  if (Array.isArray(controls.include) && !controls.include.includes('device')) return null;
  if (Array.isArray(controls.exclude) && controls.exclude.includes('device')) return null;
  const options = (argTypes as Record<string, any>).device?.options;
  if (!Array.isArray(options) || options.length < 2 || !options.every((o) => DEVICES.includes(o))) return null;
  return options;
};

/** Takes the device radio out of the Controls table where the canvas shows the selector instead */
export const hideDeviceControl: ArgTypesEnhancer = (context) => {
  const { argTypes } = context;
  if (!deviceOptions(context as unknown as Ctx)) return argTypes;
  return { ...argTypes, device: { ...argTypes.device, table: { ...argTypes.device.table, disable: true } } };
};

/** Renders the selector (Tabs) at the top of the canvas, above the story */
export const withDeviceSelector: Decorator = (Story, context) => {
  const [args, updateArgs] = useArgs();
  const options = deviceOptions(context as unknown as Ctx);
  if (!options || args.device === undefined) return Story();
  const labels: Record<string, string> = { ...LABELS, ...((context.argTypes.device as any)?.labels ?? {}) };
  const layout = context.parameters.layout ?? 'centered';
  return (
    <div
      className="is-sb-device-selector"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: layout === 'centered' ? 'center' : 'stretch',
        gap: 32,
        padding: layout === 'fullscreen' ? '16px 0 0' : 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs
          device="web"
          options={options.map((value) => ({ value, label: labels[value] ?? value }))}
          value={String(args.device)}
          onChange={(device) => updateArgs({ device })}
          width={options.length * 90}
          aria-label="Device"
        />
      </div>
      {Story()}
    </div>
  );
};
