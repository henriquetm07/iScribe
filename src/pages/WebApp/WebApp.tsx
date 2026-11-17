import { useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icons';
import { IconButton } from '../../components/IconButton/IconButton';
import { RTNHeader, type RTNPatient } from '../../components/RTNHeader/RTNHeader';
import { rtnTabs, type RtnTopic } from '../../components/RTNItems/RTNItems';
import { RtnSample } from '../../components/RTNItems/RtnSample';
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

/** Topics shown on today's note, as in the Figma page */
const TODAY_TOPICS: RtnTopic[] = ['macros', 'diagnoses', 'orders'];

const toPatient = (a: ScheduleSideBarAppointment): RTNPatient => {
  const [firstName, ...rest] = a.name.split(' ');
  return { firstName, lastName: rest.join(' '), sex: a.sex ?? '', dob: a.dateOfBirth ?? '', age: a.age ?? '', photo: a.photo };
};

/** The note for one visit: tabs, then today's note, the previous note or chart prep. One Tabs, so the selector slides. */
const VisitNote = ({ sections }: { sections: PreviousNoteSection[] }) => {
  const [tab, setTab] = useState('current-note');
  const [filled, setFilled] = useState<RtnTopic[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const allIds = sections.flatMap((s) => s.entries.map((e) => e.id));
  const toggle = (id: string) => setAdded((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  // Sections with something added from the previous note are "pulled forward" into today's note
  const pulled = sections
    .filter((s) => s.entries.some((e) => added.includes(e.id)))
    .map((s) => ({ title: s.title, icon: s.icon as IconName }));
  const previous = tab === 'previous-note';

  return (
    <div className={previous ? 'is-pn-frame is-pn-frame--web is-pn-frame--default is-webapp__frame' : 'is-rtn-frame is-rtn-frame--web is-webapp__frame'}>
      <div className={previous ? 'is-pn-frame__top' : 'is-rtn-frame__tabs'}>
        <Tabs device="web" options={rtnTabs} value={tab} onChange={setTab} aria-label="Note" />
        {previous && (
          <div className="is-pn-frame__header">
            <DateAndProvider
              device="web"
              date={samplePreviousNote.date}
              visitType={samplePreviousNote.visitType}
              timeSpan={samplePreviousNote.timeSpan}
              provider={samplePreviousNote.provider}
            />
            <CheckCounter device="web" count={added.length} onClick={() => setAdded(added.length === allIds.length ? [] : allIds)} />
          </div>
        )}
      </div>
      {previous && <hr className="is-pn-separator" />}
      {previous ? (
        <div className="is-pn-frame__body">
          {sections.map((s) => (
            <PreviousNoteSectionView key={s.id} device="web" section={s} added={added} onAdd={toggle} />
          ))}
        </div>
      ) : tab === 'current-note' ? (
        <div className="is-rtn-frame__note">
          {pulled.length > 0 && <PreviousNoteSummary device="web" sections={pulled} />}
          <div className="is-rtn-frame__list">
            {TODAY_TOPICS.map((t) => (
              <RtnSample
                key={`${t}-${filled.includes(t)}`}
                device="web"
                topic={t}
                state={filled.includes(t) ? 'filled' : 'empty'}
                onAdd={() => setFilled((f) => (f.includes(t) ? f : [...f, t]))}
              />
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
  const appointment = useMemo(
    () => [...sampleSideBarAppointments, ...samplePending].find((a) => a.id === selectedId) ?? sampleSideBarAppointments[0],
    [selectedId],
  );
  const sections = samplePreviousNote.sections as PreviousNoteSection[];

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
          appointments={sampleSideBarAppointments}
          pending={samplePending}
          selectedId={selectedId}
          onSelect={setSelectedId}
          providers={sampleProviders}
          departments={sampleDepartments}
        />
        <section className="is-webapp__note" aria-label="Visit note">
          <RTNHeader
            key={appointment.id}
            labels={[appointment.visitType ?? 'Visit', 'Room 12']}
            date={visitDate}
            time={appointment.time}
            patient={toPatient(appointment)}
          />
          <div className="is-webapp__board">
            <VisitNote key={appointment.id} sections={sections} />
          </div>
          <IconButton className="is-webapp__mic" variant="secondary" size="regular" icon={<Icon name="mic" />} label="Microphone settings" />
        </section>
      </div>
    </div>
  );
};
