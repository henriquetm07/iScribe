import type { ArgTypesEnhancer, Decorator, StrictArgTypes } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Dropdown } from '../src/components/Dropdown/Dropdown';
import { Tabs } from '../src/components/Tabs/Tabs';

/*
 * Device selector on the canvas.
 * Every story with a "device" arg (iPhone · iPad · Web) shows the Tabs component above the canvas to switch it,
 * instead of a radio in the Controls table. Stories that show every device at once (controls disabled), that
 * leave "device" out of their controls, or that set parameters.deviceSelector = false keep no selector.
 *
 * A story can also put a rounded Dropdown next to the tabs to switch another arg (e.g. the Drawer's Macros /
 * Diagnoses / Orders): parameters.canvasSelect = { arg, label, options: [{ value, label }] }. That arg leaves the
 * Controls table too.
 */

interface CanvasSelect {
  arg: string;
  label?: string;
  options: { value: string; label: string }[];
}

const canvasSelectOf = (parameters: Record<string, any>): CanvasSelect | null => {
  const c = parameters.canvasSelect;
  return c && typeof c.arg === 'string' && Array.isArray(c.options) && c.options.length > 1 ? c : null;
};

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
  let argTypes = context.argTypes;
  const hide = (name: string) => {
    if (argTypes[name]) argTypes = { ...argTypes, [name]: { ...argTypes[name], table: { ...argTypes[name].table, disable: true } } };
  };
  if (deviceOptions(context as unknown as Ctx)) hide('device');
  const select = canvasSelectOf(context.parameters);
  if (select) hide(select.arg);
  return argTypes;
};

/** Renders the selector (Tabs) at the top of the canvas, above the story */
export const withDeviceSelector: Decorator = (Story, context) => {
  const [args, updateArgs] = useArgs();
  const found = deviceOptions(context as unknown as Ctx);
  const options = found && args.device !== undefined ? found : null;
  const select = canvasSelectOf(context.parameters);
  const showSelect = !!select && args[select.arg] !== undefined;
  if (!options && !showSelect) return Story();
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
      <div style={{ position: 'relative', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        {options && (
        <Tabs
          device="web"
          tint="white"
          options={options.map((value) => ({ value, label: labels[value] ?? value }))}
          value={String(args.device)}
          onChange={(device) => updateArgs({ device })}
          width={options.length * 90}
          aria-label="Device"
        />
        )}
        {showSelect && select && (
          <Dropdown
            device="web"
            rounded
            width={140}
            options={select.options}
            value={String(args[select.arg])}
            onChange={(value) => updateArgs({ [select.arg]: value })}
            visibleRows={select.options.length}
            aria-label={select.label ?? select.arg}
          />
        )}
      </div>
      {Story()}
    </div>
  );
};
