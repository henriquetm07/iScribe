import type { PreviousNoteSection } from './PreviousNote';

/** The Figma sample previous note (RTN Main Frame (Previous Note), 3592:23089). */
export const samplePreviousNote = {
  date: 'July 30, 2026',
  visitType: 'Visit',
  timeSpan: '180 days ago',
  provider: 'Dr. Smith',
  sections: [
    {
      id: 'hpi',
      title: 'History of Present Illness',
      icon: 'history',
      entries: [
        {
          id: 'hpi-1',
          text: '42-year-old female presents for annual wellness visit. No acute concerns. Reports good energy levels and overall feeling well. Denies chest pain, shortness of breath, or other concerning symptoms.',
        },
      ],
    },
    {
      id: 'ros',
      title: 'Review of Systems',
      icon: 'system',
      entries: [
        {
          id: 'ros-1',
          text: 'Constitutional: Denies fever, chills, night sweats, or unintentional weight loss. Cardiovascular: Denies chest pain, palpitations, or leg swelling. Respiratory: Denies cough or shortness of breath.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Physical Examination',
      icon: 'exam',
      entries: [
        {
          id: 'exam-1',
          text: 'Vital signs stable. Blood pressure 128/82. General appearance: Well-appearing, no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Respiratory: Clear to auscultation bilaterally.',
        },
      ],
    },
    { id: 'pro-doc', title: 'Procedure Documentation', icon: 'documentation', entries: [{ id: 'pro-doc-1', text: 'None recorded.' }] },
    {
      id: 'plan',
      title: 'Assessment & Plan',
      icon: 'plan',
      entries: [
        {
          id: 'plan-1',
          text: 'Continue current antihypertensive medication. Lifestyle counseling provided regarding diet and exercise. Patient agreeable to plan. Follow-up in 6 months or sooner if concerns arise.',
        },
      ],
    },
    {
      id: 'dx',
      title: 'Diagnoses',
      icon: 'diagnosis',
      entries: [
        { id: 'dx-1', text: 'Hypertension, essential', code: 'I10' },
        { id: 'dx-2', text: 'Hyperlipidemia', code: 'E78.5' },
      ],
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: 'order',
      entries: [
        { id: 'orders-1', text: 'CBC with differential' },
        { id: 'orders-2', text: 'Comprehensive metabolic panel' },
        { id: 'orders-3', text: 'Lipid panel' },
      ],
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: 'billing',
      entries: [
        { id: 'billing-1', text: 'Periodic comprehensive preventive medicine evaluation', code: '99395', codeTone: 'accent' },
        { id: 'billing-2', text: 'Venipuncture for collection of specimen(s)', code: '36415', codeTone: 'accent' },
      ],
    },
  ] satisfies PreviousNoteSection[],
};
