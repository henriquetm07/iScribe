import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { IconButton } from '../../components/IconButton/IconButton';
import { formatRTNDate, RTNHeader, type RTNPatient } from '../../components/RTNHeader/RTNHeader';
import { RtnDiagnosis, RtnItem, RtnItemContent, RtnOrder, RtnText, rtnTabs } from '../../components/RTNItems/RTNItems';
import { DrawerSample, drawerSampleKinds, type DrawerSampleKind } from '../../components/Drawer/DrawerSample';
import {
  CheckCounter,
  DateAndProvider,
  PreviousNoteSectionView,
  PreviousNoteSummary,
  type PreviousNoteSection,
} from '../../components/RTNItems/PreviousNote';
import { samplePreviousNote } from '../../components/RTNItems/samplePreviousNote';
import { ScheduleSideBar, type ScheduleSideBarAppointment } from '../../components/ScheduleSideBar/ScheduleSideBar';
import { samplePending, sampleDepartments, sampleProviders, sampleSideBarAppointments } from '../../components/ScheduleSideBar/sampleSchedule';
import { Tabs } from '../../components/Tabs/Tabs';
import { WebNavBar, type WebNavBarItem } from '../../components/WebNavBar/WebNavBar';
import '../../components/RTNItems/RTNItems.css';
import '../../components/RTNItems/PreviousNote.css';
import './WebApp.css';

/*
 * Pages / Web App — Figma "Web App V2" › Note Section (5094:35817).
 * Web Nav Bar on top; the Schedule Side Bar on the left (420px, or 180px collapsed); the Note Section on the right:
 * RTN Header (Web), then the note board with the RTN note (Chart Prep · Previous Note · Current Note) and the
 * microphone settings button in the bottom-left corner. Every part is the Storybook component, behaviour included.
 * The + on Macros, Diagnoses or Orders opens that Drawer from the right, over everything; what is picked there
 * shows up in the note (× removes it, here or in the drawer).
 */

export const webAppNavItems: WebNavBarItem[] = [
  { value: 'visits', label: 'Visits' },
  { value: 'work-list', label: 'Work List' },
  { value: 'coding-insights', label: 'Coding Insights' },
  { value: 'admin', label: 'Admin' },
  { value: 'support', label: 'Support' },
  { value: 'reports', label: 'Reports' },
  { value: 'my-account', label: 'My Account' },
  { value: 'log-out', label: 'Log Out', destructive: true },
];

const practices = ['Midlands Orthopaedics', 'Midlands Orthopaedics Surgery Center, LLC', 'Michigan Ear Institute', 'MI - OneHealth'].map(
  (label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label }),
);

/** Topics shown on today's note, as in the Figma page. Their + opens the matching Drawer. */
const TODAY_TOPICS: DrawerSampleKind[] = ['macros', 'diagnoses', 'orders'];

/** What was picked in each Drawer (ids, newest first) */
type Picks = Record<DrawerSampleKind, string[]>;
const NO_PICKS: Picks = { macros: [], diagnoses: [], orders: [] };

const toPatient = (a: ScheduleSideBarAppointment): RTNPatient => {
  const [firstName, ...rest] = a.name.split(' ');
  return { firstName, lastName: rest.join(' '), sex: a.sex ?? '', dob: a.dateOfBirth ?? '', age: a.age ?? '', photo: a.photo };
};

/** "4:49 PM": the time format the schedule uses */
const clockTime = (d: Date) => {
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** A note started with "New Note": no patient yet, at the time it was created */
interface NewNote {
  id: string;
  created: Date;
  time: string;
  /** The demographics as typed in the RTN Header (none until the user fills them in) */
  patient?: RTNPatient;
  /** Becomes "Note in Progress" once the demographics change, a recording starts or an item is added */
  started: boolean;
}

/** The card for a new note in the Schedule Side Bar: placeholders until the demographics are filled in */
const newNoteCard = (n: NewNote): ScheduleSideBarAppointment => {
  const p = n.patient;
  const name = p ? `${p.firstName} ${p.lastName}`.trim() : '';
  return {
    id: n.id,
    name: name || 'Patient Name',
    time: n.time,
    status: n.started ? 'note-in-progress' : 'new-note',
    sex: p?.sex || 'Sex',
    dateOfBirth: p?.dob || 'DOB',
    age: p?.age || 'Age',
    visitType: 'Visit',
    ehr: 'athena',
    integrated: false,
    appointmentType: 'Office Visit',
  };
};

/** The note for one visit: tabs, then today's note, the previous note or chart prep. One Tabs, so the selector slides. */
const VisitNote = ({ sections, onActivity }: { sections: PreviousNoteSection[]; onActivity?: () => void }) => {
  const [tab, setTab] = useState('current-note');
  const [added, setAdded] = useState<string[]>([]);
  // + on Macros, Diagnoses or Orders opens that Drawer from the right, over the whole app
  const [picks, setPicks] = useState<Picks>(NO_PICKS);
  const [drawer, setDrawer] = useState<DrawerSampleKind>('macros');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const setPicked = (kind: DrawerSampleKind, ids: string[]) => {
    setPicks((p) => ({ ...p, [kind]: ids }));
    onActivity?.();
  };
  const openDrawer = (kind: DrawerSampleKind) => {
    setDrawer(kind);
    setDrawerOpen(true);
  };
  /** The note entry for a picked item */
  const entry = (kind: DrawerSampleKind, id: string) => {
    const it = drawerSampleKinds[kind].items.find((x) => x.id === id);
    if (!it) return null;
    return (
      <RtnItemContent key={id} device="web" onRemove={() => setPicked(kind, picks[kind].filter((x) => x !== id))}>
        {kind === 'macros' ? (
          <RtnText device="web">{it.name}</RtnText>
        ) : kind === 'diagnoses' ? (
          <RtnDiagnosis
            device="web"
            name={it.name}
            code={it.label}
            active={activeProblems.includes(id)}
            onActiveChange={(on) => setActiveProblems((a) => (on ? [...a, id] : a.filter((x) => x !== id)))}
          />
        ) : (
          <RtnOrder device="web" name={it.name} />
        )}
      </RtnItemContent>
    );
  };
  const allIds = sections.flatMap((s) => s.entries.map((e) => e.id));
  const toggle = (id: string) => {
    setAdded((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
    onActivity?.();
  };
  // Sections with something added from the previous note are "pulled forward" into today's note
  const pulled = sections
    .filter((s) => s.entries.some((e) => added.includes(e.id)))
    .map((s) => ({ title: s.title, icon: s.icon as IconName }));
  const previous = tab === 'previous-note';

  // A new patient has no previous note
  const noPrevious = sections.length === 0;

  return (
    <div
      className={
        previous
          ? `is-pn-frame is-pn-frame--web is-pn-frame--${noPrevious ? 'empty' : 'default'} is-webapp__frame`
          : 'is-rtn-frame is-rtn-frame--web is-webapp__frame'
      }
    >
      <div className={previous ? 'is-pn-frame__top' : 'is-rtn-frame__tabs'}>
        <Tabs device="web" options={rtnTabs} value={tab} onChange={setTab} aria-label="Note" />
        {previous && !noPrevious && (
          <div className="is-pn-frame__header">
            <DateAndProvider
              device="web"
              date={samplePreviousNote.date}
              visitType={samplePreviousNote.visitType}
              timeSpan={samplePreviousNote.timeSpan}
              provider={samplePreviousNote.provider}
            />
            <CheckCounter
              device="web"
              count={added.length}
              onClick={() => {
                setAdded(added.length === allIds.length ? [] : allIds);
                onActivity?.();
              }}
            />
          </div>
        )}
      </div>
      {previous && <hr className="is-pn-separator" />}
      {previous ? (
        <div className="is-pn-frame__body">
          {noPrevious ? (
            <div className="is-pn-empty">
              <p className="is-pn-empty__title">No Previous Notes</p>
              <p className="is-pn-empty__body">This patient is new to the practice, so there’s no prior history.</p>
            </div>
          ) : (
            sections.map((s) => <PreviousNoteSectionView key={s.id} device="web" section={s} added={added} onAdd={toggle} />)
          )}
        </div>
      ) : tab === 'current-note' ? (
        <div className="is-rtn-frame__note">
          {pulled.length > 0 && <PreviousNoteSummary device="web" sections={pulled} />}
          <div className="is-rtn-frame__list">
            {TODAY_TOPICS.map((t) => (
              <RtnItem key={t} device="web" topic={t} onAdd={() => openDrawer(t)}>
                {picks[t].map((id) => entry(t, id))}
              </RtnItem>
            ))}
          </div>
          <div className="is-rtn-frame__bottom">
            <span className="is-rtn-frame__autosaved">Autosaved <Icon name="check" size={12} /></span>
          </div>
        </div>
      ) : (
        <div className="is-rtn-frame__note is-webapp__chart-prep">
          <p className="is-pn-empty__title">Chart Prep</p>
          <p className="is-pn-empty__body">Nothing to prepare for this visit yet.</p>
        </div>
      )}
      <DrawerSample
        key={drawer}
        kind={drawer}
        device="web"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        added={picks[drawer]}
        onAddedChange={(ids) => setPicked(drawer, ids)}
      />
    </div>
  );
};

export interface WebAppProps {
  /** Start with the Schedule Side Bar collapsed (180px) */
  defaultCollapsed?: boolean;
  /** The appointment open on the right */
  defaultSelectedId?: string;
  /** Visit date shown in the RTN Header */
  visitDate?: string;
}

/** Pages / Web App: the iScribe web app with a visit open (Figma "Web App V2" › Note Section). */
export const WebApp = ({ defaultCollapsed = false, defaultSelectedId = '6', visitDate = 'Oct 23, 2026' }: WebAppProps) => {
  const [selectedId, setSelectedId] = useState(defaultSelectedId);
  const [newNotes, setNewNotes] = useState<NewNote[]>([]);
  const appointments = useMemo(() => [...sampleSideBarAppointments, ...newNotes.map(newNoteCard)], [newNotes]);
  const newNote = newNotes.find((n) => n.id === selectedId);
  const appointment = useMemo(
    () => [...appointments, ...samplePending].find((a) => a.id === selectedId) ?? sampleSideBarAppointments[0],
    [appointments, selectedId],
  );
  const sections = samplePreviousNote.sections as PreviousNoteSection[];

  const updateNew = (id: string, change: Partial<NewNote>) => setNewNotes((list) => list.map((n) => (n.id === id ? { ...n, ...change } : n)));
  const start = (id: string) => setNewNotes((list) => list.map((n) => (n.id === id && !n.started ? { ...n, started: true } : n)));

  /** Leaving a new note that was never touched (no demographics, recording or items) erases it */
  const dropUntouched = (list: NewNote[], leaving: string) => list.filter((n) => n.id !== leaving || n.started);

  /** Open another note from the schedule */
  const select = (id: string) => {
    if (id === selectedId) return;
    setNewNotes((list) => dropUntouched(list, selectedId));
    setSelectedId(id);
  };

  /** "New Note": an empty note at the current time, opened at once */
  const createNote = () => {
    const created = new Date();
    const note: NewNote = { id: `new-${created.getTime()}`, created, time: clockTime(created), started: false };
    setNewNotes((list) => [...dropUntouched(list, selectedId), note]);
    setSelectedId(note.id);
  };

  // Bring the newly selected card into view in the side bar
  useEffect(() => {
    if (!selectedId.startsWith('new-')) return;
    const frame = requestAnimationFrame(() =>
      document.querySelector('.is-webapp .is-ssb .is-sli--selected')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [selectedId]);

  return (
    <div className="is-webapp">
      <WebNavBar
        items={webAppNavItems}
        defaultValue="visits"
        chromeExtension
        practices={practices}
        defaultPractice={practices[0].value}
        connectivityAlert
      />
      <div className="is-webapp__main">
        <ScheduleSideBar
          platform="web"
          defaultCollapsed={defaultCollapsed}
          appointments={appointments}
          pending={samplePending}
          selectedId={selectedId}
          onSelect={select}
          onNewNote={createNote}
          providers={sampleProviders}
          departments={sampleDepartments}
        />
        <section className="is-webapp__note" aria-label="Visit note">
          {newNote ? (
            <RTNHeader
              key={newNote.id}
              labels={['Visit']}
              date={formatRTNDate(newNote.created)}
              time={newNote.time}
              checkedIn=""
              patient={newNote.patient ?? null}
              onPatientChange={(patient) => updateNew(newNote.id, { patient, started: true })}
              onRecordStateChange={(state) => state !== 'idle' && start(newNote.id)}
            />
          ) : (
            <RTNHeader
              key={appointment.id}
              labels={[appointment.visitType ?? 'Visit', 'Room 12']}
              date={visitDate}
              time={appointment.time}
              patient={toPatient(appointment)}
            />
          )}
          <div className="is-webapp__board">
            <VisitNote
              key={appointment.id}
              sections={newNote ? [] : sections}
              onActivity={newNote ? () => start(newNote.id) : undefined}
            />
          </div>
          <IconButton className="is-webapp__mic" variant="secondary" size="regular" icon={<Icon name="mic" />} label="Microphone settings" />
        </section>
      </div>
    </div>
  );
};
