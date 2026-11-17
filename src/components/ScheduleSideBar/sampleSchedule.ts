/** Sample data from the Figma "Schedule Side Tab" page */
import { sampleAppointments } from '../ScheduleList/sampleAppointments';
import type { ScheduleSideBarAppointment } from './ScheduleSideBar';

export const sampleProviders = [
  'Anderson, Lynn (landerson17)',
  'Brady, Billy (bbrady7)',
  'Bricker, Adam',
  'Bricker, Adam (abricker1)',
  'Bulkley-Jones, Chris (cbulkey)',
  'Burson, John (jburson)',
  'Cali, Doctor (dcali)',
  'Carter, John (dharvey3)',
  'Dulkley-Jones, Chris (dbulkey)',
  'Eurson, John (eburson)',
  'Fali, Doctor (fcali)',
  'Garter, John (gharvey3)',
  'Harter, John (hharvey3)',
];

export const sampleDepartments = ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics'];

const providers = ['Bulkley-Jones, Chris (cbulkey)', 'Cali, Doctor (dcali)', 'Anderson, Lynn (landerson17)'];

/** The Schedule List sample, with an appointment type, provider and department for the filters */
export const sampleSideBarAppointments: ScheduleSideBarAppointment[] = sampleAppointments.map((a, i) => ({
  ...a,
  appointmentType: i === 3 || i === 7 ? 'Surgery' : 'Office Visit',
  provider: providers[i % providers.length],
  department: sampleDepartments[i % 2],
}));

/** Notes still to finish (Pending tab) */
export const samplePending: ScheduleSideBarAppointment[] = sampleSideBarAppointments
  .filter((a) => a.status === 'note-in-progress' || a.status === 'checked-in')
  .concat({ ...sampleSideBarAppointments[0], id: 'p1', time: '4:30 PM', status: 'note-in-progress' });
