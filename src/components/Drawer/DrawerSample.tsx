import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { IconName } from '../../icons/icons';
import { Drawer, type DrawerProps } from './Drawer';
import { DrawerDiagnosesListItem, DrawerList, DrawerListTitle, DrawerMacroListItem, DrawerNoResults } from './DrawerList';

/*
 * Working samples of the Drawer for each kind of content in Figma: "Drawer - Macros" (918:11601),
 * "Drawer - Diagnoses" (947:1517) and "Drawer - Orders" (3134:36940).
 */

/** Length of the add animation (matches --is-drawer-wipe-ms in Drawer.css) */
const WIPE_MS = 200;

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
  orders: { label: 'Orders', title: 'Add Orders', icon: 'order', placeholder: 'Search Orders...', noun: 'Orders', items: sampleOrders, filter: false, added: ['o1'] },
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
 * wipes out of its place while it wipes in on top of "Added …"), × removes it, and a search with no match shows "No results". No filter button.
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
  // Adding plays both wipes at once, same length: the item wipes out of its place (bottom to top) while its
  // Added version wipes in on top (top to bottom); the list closes and opens around them.
  const [moving, setMoving] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = (id: string) => {
    if (added.includes(id)) {
      setAdded((a) => a.filter((x) => x !== id));
      return;
    }
    setAdded((a) => [id, ...a]);
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    clearTimeout(timer.current);
    setMoving(id);
    timer.current = setTimeout(() => setMoving(null), WIPE_MS);
  };
  const q = query.trim().toLowerCase();

  /** One item. `ghost`: the copy left in the old place while it wipes out (shown as not added). */
  const item = (it: SampleDrawerItem, ghost = false) => {
    const isAdded = !ghost && added.includes(it.id);
    const motion = moving === it.id ? (ghost ? 'wipe-out' : 'wipe-in') : undefined;
    const key = ghost ? `${it.id}-out` : it.id;
    return kind === 'macros' ? (
      <DrawerMacroListItem
        key={key}
        device={device}
        name={it.name}
        section={it.label}
        source={it.source}
        added={isAdded}
        onToggle={() => toggle(it.id)}
        motion={motion}
      />
    ) : (
      <DrawerDiagnosesListItem
        key={key}
        device={device}
        name={it.name}
        label={it.label}
        added={isAdded}
        onToggle={() => toggle(it.id)}
        motion={motion}
      />
    );
  };

  let content: ReactNode;
  if (q) {
    const found = list.filter((it) => `${it.name} ${it.label}`.toLowerCase().includes(q));
    content = found.length ? (
      <DrawerList>
        <DrawerListTitle device={device}>Search Results</DrawerListTitle>
        {/* While moving, the Added version opens on top of the old one, which closes */}
        {found.flatMap((it) => (it.id === moving ? [item(it), item(it, true)] : [item(it)]))}
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
            {addedItems.map((it) => item(it))}
          </>
        )}
        <DrawerListTitle device={device}>All {k.noun}</DrawerListTitle>
        {list.filter((it) => !added.includes(it.id) || it.id === moving).map((it) => item(it, it.id === moving))}
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
