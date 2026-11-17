/** The appointments from the Figma "Schedule List" example (sample photo served from .storybook/public/samples) */
import type { ScheduleListEntry } from './ScheduleList';

const patient = { sex: 'Female', dateOfBirth: '03/15/1982', age: 42, ehr: 'athena', integrated: true } as const;

export const sampleAppointments: ScheduleListEntry[] = [
  { id: '1', name: 'Mathieu Donte', time: '8:00 AM', status: 'sent-to-ehr', ...patient },
  { id: '2', name: 'Fauver Khalilah', time: '8:20 AM', status: 'sent-to-ehr', ...patient },
  { id: '3', name: 'Candelario Johnson', time: '8:40 AM', status: 'copied-to-ehr', ...patient, integrated: false },
  { id: '4', name: 'Harris Malcolm', time: '9:00 AM', status: 'not-checked-in', ...patient },
  { id: '5', name: 'William Black', time: '9:20 AM', status: 'sent-to-ehr', ...patient },
  { id: '6', name: 'Sarah Johnson', time: '9:40 AM', status: 'note-in-progress', ...patient, photo: './samples/patient-sample.jpg' },
  { id: '7', name: 'Crum Lucien', time: '10:00 AM', status: 'checked-in', ...patient },
  { id: '8', name: 'Anna Johnson', time: '10:20 AM', status: 'not-checked-in', ...patient },
  { id: '9', name: 'Carol Johnson', time: '10:40 AM', status: 'not-checked-in', ...patient },
];
