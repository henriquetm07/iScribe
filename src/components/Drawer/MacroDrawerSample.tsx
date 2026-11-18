import { useState } from 'react';
import { Drawer, type DrawerProps } from './Drawer';
import { DrawerList, DrawerListTitle, DrawerMacroListItem, DrawerNoResults } from './DrawerList';

/** Sample macros (Figma "Drawer List Modal") */
export interface SampleMacro {
  id: string;
  name: string;
  section: string;
  source: string;
}

export const sampleMacros: SampleMacro[] = [
  { id: 'm1', name: 'Insert normal shoulder exam', section: 'PE', source: 'Athena' },
  { id: 'm2', name: 'Physical examination: within normal limits', section: 'PE', source: 'Athena' },
  { id: 'm3', name: 'Cardiovascular: regular rate and rhythm, no murmurs', section: 'ROS', source: 'Athena' },
  { id: 'm4', name: 'Shoulder injection, subacromial', section: 'Procedures', source: 'Athena' },
  { id: 'm5', name: 'Respiratory: clear to auscultation bilaterally', section: 'ROS', source: 'Athena' },
  { id: 'm6', name: 'Insert normal knee exam', section: 'PE', source: 'Athena' },
  { id: 'm7', name: 'Musculoskeletal: full range of motion, no tenderness', section: 'PE', source: 'Athena' },
  { id: 'm8', name: 'Neurological: alert and oriented ×3', section: 'ROS', source: 'Athena' },
  { id: 'm9', name: 'Knee aspiration', section: 'Procedures', source: 'Athena' },
  { id: 'm10', name: 'Skin: warm, dry, no rashes', section: 'PE', source: 'Athena' },
];

export interface MacroDrawerSampleProps extends Omit<DrawerProps, 'children' | 'searchValue' | 'onSearchChange'> {
  /** Text already in the search field */
  defaultQuery?: string;
  /** Macros already added */
  defaultAdded?: string[];
  macros?: SampleMacro[];
}

/**
 * A working "Add Macros" Drawer: search filters the list, + adds a macro (it moves to "Added Macros"), × removes it.
 * Typing something with no match shows "No results". Macros have no filter button next to the search field.
 */
export const MacroDrawerSample = ({
  device = 'iphone',
  defaultQuery = '',
  defaultAdded = ['m1'],
  macros = sampleMacros,
  title = 'Add Macros',
  icon = 'macros',
  searchPlaceholder = 'Search Macros...',
  filter = false,
  ...props
}: MacroDrawerSampleProps) => {
  const [query, setQuery] = useState(defaultQuery);
  const [added, setAdded] = useState<string[]>(defaultAdded);
  const toggle = (id: string) => setAdded((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const q = query.trim().toLowerCase();
  const item = (m: SampleMacro) => (
    <DrawerMacroListItem
      key={m.id}
      device={device}
      name={m.name}
      section={m.section}
      source={m.source}
      added={added.includes(m.id)}
      onToggle={() => toggle(m.id)}
    />
  );

  let content;
  if (q) {
    const found = macros.filter((m) => `${m.name} ${m.section}`.toLowerCase().includes(q));
    content = found.length ? (
      <DrawerList>
        <DrawerListTitle device={device}>Search Results</DrawerListTitle>
        {found.map(item)}
      </DrawerList>
    ) : (
      <DrawerNoResults device={device} query={query.trim()} />
    );
  } else {
    const addedMacros = added.map((id) => macros.find((m) => m.id === id)).filter((m): m is SampleMacro => !!m);
    content = (
      <DrawerList>
        {addedMacros.length > 0 && (
          <>
            <DrawerListTitle device={device}>Added Macros</DrawerListTitle>
            {addedMacros.map(item)}
          </>
        )}
        <DrawerListTitle device={device}>All Macros</DrawerListTitle>
        {macros.filter((m) => !added.includes(m.id)).map(item)}
      </DrawerList>
    );
  }

  return (
    <Drawer
      device={device}
      title={title}
      icon={icon}
      searchPlaceholder={searchPlaceholder}
      filter={filter}
      searchValue={query}
      onSearchChange={setQuery}
      {...props}
    >
      {content}
    </Drawer>
  );
};
