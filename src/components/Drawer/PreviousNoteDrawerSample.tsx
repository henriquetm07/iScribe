import { useState } from 'react';
import type { IconName } from '../../icons/icons';
import { Drawer, type DrawerProps } from './Drawer';
import { DrawerChecklistItem, DrawerList } from './DrawerList';

/*
 * Working sample of Figma "Drawer - Add from Previous Note (Checklist)" (915:12884): the sections of the previous
 * note, each with a + to pull it forward into the current note. Added rows turn green with a check, and the
 * header's green badge counts them. No search or filter.
 * A section with entries under it (Diagnoses, Orders, Billing Services) works as "all of them": adding it adds every
 * entry, removing it removes them; once every entry is added the section is too, and removing one entry un-adds it.
 */

export interface PreviousNoteSection {
  id: string;
  name: string;
  /** Section icon; entries under a section have none (they sit indented) */
  icon?: IconName;
  /** Code before the name, e.g. an ICD or billing code */
  label?: string;
  labelTone?: 'neutral' | 'accent';
}

/** The previous note in the Figma sample */
export const samplePreviousNoteSections: PreviousNoteSection[] = [
  { id: 'hpi', name: 'History of Present Illness', icon: 'history' },
  { id: 'ros', name: 'Review of Systems', icon: 'system' },
  { id: 'pe', name: 'Physical Examination', icon: 'exam' },
  { id: 'proc', name: 'Procedure Documentation', icon: 'documentation' },
  { id: 'ap', name: 'Assessment & Plan', icon: 'plan' },
  { id: 'dx', name: 'Diagnoses', icon: 'diagnosis' },
  { id: 'dx-i10', name: 'Hypertension, essential', label: 'I10' },
  { id: 'dx-e785', name: 'Hyperlipidemia', label: 'E78.5' },
  { id: 'orders', name: 'Orders', icon: 'order' },
  { id: 'o-cbc', name: 'CBC with differential' },
  { id: 'o-cmp', name: 'Comprehensive metabolic panel' },
  { id: 'o-lipid', name: 'Lipid panel' },
  { id: 'billing', name: 'Billing Services', icon: 'billing' },
  { id: 'b-99870', name: 'Periodic comprehensive preventive medicine', label: '99870', labelTone: 'accent' },
  { id: 'b-36415', name: 'Venipuncture for collection of blood', label: '36415', labelTone: 'accent' },
];

export const PREVIOUS_NOTE_TITLE = 'Add from Previous Note';
export const PREVIOUS_NOTE_DESCRIPTION = 'You haven’t pulled forward any sections into your current note';

export interface PreviousNoteDrawerSampleProps
  extends Omit<DrawerProps, 'children' | 'search' | 'searchValue' | 'onSearchChange' | 'filter' | 'filterCount' | 'onFilter' | 'count'> {
  /** Sections already added (ids) */
  defaultAdded?: string[];
  /** Added sections (ids), controlled */
  added?: string[];
  onAddedChange?: (ids: string[]) => void;
  /** Replace the sample sections */
  sections?: PreviousNoteSection[];
}

/** The entries under each section: the icon-less rows that follow it */
const entriesBySection = (sections: PreviousNoteSection[]) => {
  const map = new Map<string, string[]>();
  let current: string | null = null;
  for (const s of sections) {
    if (s.icon) {
      current = s.id;
      map.set(s.id, []);
    } else if (current) map.get(current)!.push(s.id);
  }
  return map;
};

/** A working "Add from Previous Note" drawer: + adds a section (green, check), a tap on an added one removes it */
export const PreviousNoteDrawerSample = ({
  defaultAdded = ['hpi', 'ros'],
  added: addedProp,
  onAddedChange,
  sections = samplePreviousNoteSections,
  device = 'iphone',
  title = PREVIOUS_NOTE_TITLE,
  icon = 'macros',
  description = PREVIOUS_NOTE_DESCRIPTION,
  ...props
}: PreviousNoteDrawerSampleProps) => {
  const [own, setOwn] = useState(defaultAdded);
  const added = addedProp ?? own;
  const entries = entriesBySection(sections);
  const parentOf = (id: string) => [...entries].find(([, kids]) => kids.includes(id))?.[0];
  const toggle = (id: string) => {
    const on = !added.includes(id);
    const kids = entries.get(id) ?? [];
    let next = on ? [...added, ...[id, ...kids].filter((x) => !added.includes(x))] : added.filter((x) => x !== id && !kids.includes(x));
    // An entry: its section follows whether all of its entries are added
    const parent = parentOf(id);
    if (parent) {
      const all = (entries.get(parent) ?? []).every((x) => next.includes(x));
      if (all && !next.includes(parent)) next = [...next, parent];
      if (!all) next = next.filter((x) => x !== parent);
    }
    if (addedProp === undefined) setOwn(next);
    onAddedChange?.(next);
  };
  return (
    <Drawer
      device={device}
      title={title}
      icon={icon}
      description={description}
      count={added.length}
      search={false}
      filter={false}
      {...props}
    >
      <DrawerList>
        {sections.map((s) => (
          <DrawerChecklistItem
            key={s.id}
            device={device}
            name={s.name}
            icon={s.icon}
            label={s.label}
            labelTone={s.labelTone}
            added={added.includes(s.id)}
            onToggle={() => toggle(s.id)}
          />
        ))}
      </DrawerList>
    </Drawer>
  );
};
