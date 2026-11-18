import { DrawerSample, sampleMacros, type DrawerSampleProps, type SampleDrawerItem } from './DrawerSample';

/** @deprecated Use DrawerSample with kind="macros". Kept for existing imports. */
export type SampleMacro = SampleDrawerItem;
export { sampleMacros };

export type MacroDrawerSampleProps = Omit<DrawerSampleProps, 'kind'> & { macros?: SampleDrawerItem[] };

/** The Macros Drawer sample (DrawerSample, kind "macros") */
export const MacroDrawerSample = ({ macros, ...props }: MacroDrawerSampleProps) => <DrawerSample kind="macros" items={macros} {...props} />;
