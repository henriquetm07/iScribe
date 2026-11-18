import { useState, type ReactNode } from 'react';
import type { IconName } from '../../icons/icons';
import { Drawer, type DrawerProps } from './Drawer';
import { DrawerDiagnosesListItem, DrawerList, DrawerListTitle, DrawerMacroListItem, DrawerNoResults } from './DrawerList';

/*
 * Working samples of the Drawer for each kind of content in Figma: "Drawer - Macros" (918:11601),
 * "Drawer - Diagnoses" (947:1517) and "Drawer - Orders" (3134:36940).
 */

export type DrawerSampleKind = 'macros' | 'diagnoses' | 'orders';

export interface SampleDrawerItem {
  id: string;
  name: string;
  /** Macros: the section (PE, ROS…) · Diagnoses: the ICD code · Orders: the order type (Lab, Imaging…) */
  label: string;
  /** Macros only: where it comes from (e.g. "Athena") */
  source?: string;
}

export const sampleMacros: SampleDrawerItem[] = [
  { id: 'm1', name: 'Insert normal shoulder exam', label: 'PE', source: 'Athena' },
  { id: 'm2', name: 'Physical examination: within normal limits', label: 'PE', source: 'Athena' },
  { id: 'm3', name: 'Cardiovascular: regular rate and rhythm, no murmurs', label: 'ROS', source: 'Athena' },
  { id: 'm4', name: 'Shoulder injection, subacromial', label: 'Procedures', source: 'Athena' },
  { id: 'm5', name: 'Respiratory: clear to auscultation bilaterally', label: 'ROS', source: 'Athena' },
  { id: 'm6', name: 'Insert normal knee exam', label: 'PE', source: 'Athena' },
  { id: 'm7', name: 'Musculoskeletal: full range of motion, no tenderness', label: 'PE', source: 'Athena' },
  { id: 'm8', name: 'Neurological: alert and oriented ×3', label: 'ROS', source: 'Athena' },
  { id: 'm9', name: 'Knee aspiration', label: 'Procedures', source: 'Athena' },
  { id: 'm10', name: 'Skin: warm, dry, no rashes', label: 'PE', source: 'Athena' },
];

export const sampleDiagnoses: SampleDrawerItem[] = [
  { id: 'd1', name: 'Tear of medial meniscus of knee (Right)', label: 'S83.241A' },
  { id: 'd2', name: 'Primary osteoarthritis, right knee', label: 'M17.11' },
  { id: 'd3', name: 'Pain in right shoulder', label: 'M25.511' },
  { id: 'd4', name: 'Rotator cuff tear, right shoulder', label: 'M75.101' },
  { id: 'd5', name: 'Low back pain, unspecified', label: 'M54.50' },
  { id: 'd6', name: 'Essential (primary) hypertension', label: 'I10' },
  { id: 'd7', name: 'Type 2 diabetes mellitus without complications', label: 'E11.9' },
  { id: 'd8', name: 'Hyperlipidemia, unspecified', label: 'E78.5' },
  { id: 'd9', name: 'Asthma, unspecified', label: 'J45.909' },
  { id: 'd10', name: 'Acute upper respiratory infection', label: 'J06.9' },
];

export const sampleOrders: SampleDrawerItem[] = [
  { id: 'o1', name: 'MRI procedure (PROC)', label: 'Procedure' },
  { id: 'o2', name: 'CBC w/ auto diff', label: 'Lab' },
  { id: 'o3', name: 'MRI, spine, w/ contrast', label: 'Imaging' },
  { id: 'o4', name: 'Dyspnea', label: 'Set' },
  { id: 'o5', name: 'X-ray, knee, 3 views', label: 'Imaging' },
  { id: 'o6', name: 'Basic metabolic panel', label: 'Lab' },
  { id: 'o7', name: 'Physical therapy evaluation', label: 'Procedure' },
  { id: 'o8', name: 'Lipid panel', label: 'Lab' },
  { id: 'o9', name: 'Post-op knee', label: 'Set' },
  { id: 'o10', name: 'CT, chest, w/o contrast', label: 'Imaging' },
];

/** What changes between the kinds: title, icon, search placeholder, group names, items, filter button */
export const drawerSampleKinds: Record<
  DrawerSampleKind,
  { label: string; title: string; icon: IconName; placeholder: string; noun: string; items: SampleDrawerItem[]; filter: boolean; added: string[] }
> = {
  macros: { label: 'Macros', title: 'Add Macros', icon: 'macros', placeholder: 'Search Macros...', noun: 'Macros', items: sampleMacros, filter: false, added: ['m1'] },
  diagnoses: { label: 'Diagnoses', title: 'Add Diagnoses', icon: 'diagnosis', placeholder: 'Search Diagnoses...', noun: 'Diagnoses', items: sampleDiagnoses, filter: false, added: ['d1'] },
  orders: { label: 'Orders', title: 'Add Orders', icon: 'order', placeholder: 'Search Orders...', noun: 'Orders', items: sampleOrders, filter: true, added: ['o1'] },
};

export interface DrawerSampleProps extends Omit<DrawerProps, 'children' | 'searchValue' | 'onSearchChange'> {
  /** Macros, Diagnoses or Orders */
  kind?: DrawerSampleKind;
  /** Text already in the search field */
  defaultQuery?: string;
  /** Items already added (ids) */
  defaultAdded?: string[];
  /** Replace the sample items */
  items?: SampleDrawerItem[];
}

/**
 * A working Drawer for Macros, Diagnoses or Orders: search filters the list ("Search Results"), + adds an item (it
 * moves up to "Added …"), × removes it, and a search with no match shows "No results". Orders keep the filter button.
 */
export const DrawerSample = ({
  kind = 'macros',
  device = 'iphone',
  defaultQuery = '',
  defaultAdded,
  items,
  title,
  icon,
  searchPlaceholder,
  filter,
  filterCount = 0,
  ...props
}: DrawerSampleProps) => {
  const k = drawerSampleKinds[kind];
  const list = items ?? k.items;
  const [query, setQuery] = useState(defaultQuery);
  const [added, setAdded] = useState<string[]>(defaultAdded ?? k.added);
  const toggle = (id: string) => setAdded((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const q = query.trim().toLowerCase();

  const item = (it: SampleDrawerItem) =>
    kind === 'macros' ? (
      <DrawerMacroListItem
        key={it.id}
        device={device}
        name={it.name}
        section={it.label}
        source={it.source}
        added={added.includes(it.id)}
        onToggle={() => toggle(it.id)}
      />
    ) : (
      <DrawerDiagnosesListItem key={it.id} device={device} name={it.name} label={it.label} added={added.includes(it.id)} onToggle={() => toggle(it.id)} />
    );

  let content: ReactNode;
  if (q) {
    const found = list.filter((it) => `${it.name} ${it.label}`.toLowerCase().includes(q));
    content = found.length ? (
      <DrawerList>
        <DrawerListTitle device={device}>Search Results</DrawerListTitle>
        {found.map(item)}
      </DrawerList>
    ) : (
      <DrawerNoResults device={device} query={query.trim()} />
    );
  } else {
    const addedItems = added.map((id) => list.find((it) => it.id === id)).filter((it): it is SampleDrawerItem => !!it);
    content = (
      <DrawerList>
        {addedItems.length > 0 && (
          <>
            <DrawerListTitle device={device}>Added {k.noun}</DrawerListTitle>
            {addedItems.map(item)}
          </>
        )}
        <DrawerListTitle device={device}>All {k.noun}</DrawerListTitle>
        {list.filter((it) => !added.includes(it.id)).map(item)}
      </DrawerList>
    );
  }

  return (
    <Drawer
      device={device}
      title={title ?? k.title}
      icon={icon ?? k.icon}
      searchPlaceholder={searchPlaceholder ?? k.placeholder}
      searchValue={query}
      onSearchChange={setQuery}
      filter={filter ?? k.filter}
      filterCount={filterCount}
      {...props}
    >
      {content}
    </Drawer>
  );
};

/** The kinds as options for a picker */
export const drawerSampleOptions = (Object.keys(drawerSampleKinds) as DrawerSampleKind[]).map((value) => ({
  value,
  label: drawerSampleKinds[value].label,
}));
