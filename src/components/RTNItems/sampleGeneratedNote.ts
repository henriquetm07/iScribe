import type { GeneratedNoteSection, TranscriptLine } from './GeneratedNote';

/** The generated note in the Figma sample (RTN Items (Generated Note), 3628:16776) */
export const sampleGeneratedNote: GeneratedNoteSection[] = [
  {
    id: 'hpi',
    title: 'History of Present Illness',
    text: 'Carmine Henke is a 75-year-old male who presents for evaluation following a noncontact basketball injury. He reports hearing a pop at the time of injury and notes instability with pivoting and pain along the medial joint line. Mild swelling developed the next day. He denies locking but reports occasional giving away.',
  },
  {
    id: 'ros',
    title: 'Review of Systems',
    text: [
      'Constitutional - no fatigue, no fever, no sleep problems, no weakness, no chills, no significant weight loss, no night sweats, no loss of appetite, no excessive thirst.',
      'HEENT',
      'Eyes - no dry eyes, no irritation, no sudden onset vision change',
      'Ears - no sudden onset decreased hearing, no earache',
      'Nose - no nosebleeds, no sinus pain/pressure',
      'Mouth/Throat- no sore throat, no bleeding gums, no snoring, no dry mouth, no mouth ulcers, no oral abnormalities, no loose teeth',
      'Respiratory - no shortness of breath, no cough, no wheezing, no coughing up blood',
      'Cardiovascular - no shortness of breath when walking, no shortness of breath when lying down, no palpitations',
    ].join('\n'),
  },
  {
    id: 'pe',
    title: 'Physical Examination',
    text: 'Vital signs: Blood pressure 128/82, heart rate 68 bpm, temperature 98.6°F, respiratory rate 16, oxygen saturation 98% on room air. General: Well-appearing patient in no acute distress, alert and oriented to person, place, and time. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. Respiratory: Clear to auscultation bilaterally, no wheezes or rales. Abdomen: Soft, non-tender, non-distended, normal bowel sounds. Extremities: No edema, cyanosis, or clubbing. Neurological: Alert and oriented x3, cranial nerves II-XII intact, no focal neurological deficits.',
  },
  { id: 'proc', title: 'Procedure Documentation', text: 'No procedures performed during this encounter.' },
  {
    id: 'ap',
    title: 'Assessment & Plan',
    text: [
      'Assessment:',
      ' Jude Flaherty is a 47-year-old male with a partial ACL tear and a medial meniscus tear of the posterior horn.',
      '',
      'Plan:',
      ' A prescription for physical therapy will be provided to address pain and stability.',
      '',
      'Crutches will be provided for pain management and stability.',
      '',
      'Ibuprofen 600 mg three times a day as needed for pain and inflammation is recommended. This medication can be obtained over the counter.',
      '',
      'The patient is advised to avoid running, jumping, and pivoting sports. Swimming is permitted as long as it is pain-free.',
      '',
      'Follow-up is scheduled in two weeks',
    ].join('\n'),
  },
  {
    id: 'goals',
    title: 'Patient Goals',
    text: [
      'Patient goals discussed and established collaboratively:',
      '• Maintain current health status and prevent disease progression',
      '• Improve overall wellness through lifestyle modifications',
      '• Achieve optimal management of chronic conditions',
      '• Enhance understanding of medical conditions and treatment options',
      '• Establish realistic expectations for treatment outcomes',
    ].join('\n'),
  },
  {
    id: 'instructions',
    title: 'Instructions',
    text: [
      'Patient Instructions:',
      '',
      'Medications:',
      '- Continue current medications as prescribed',
      '- Take medications at the same time each day',
      '- Contact office if experiencing any adverse effects',
      '',
      'Lifestyle:',
      '- Maintain healthy diet with appropriate portion control',
      '- Regular exercise as tolerated and medically appropriate',
      '- Adequate sleep hygiene (7-8 hours per night)',
      '- Stress management techniques',
      '',
      'Follow-up:',
      '- Return to clinic as scheduled or sooner if concerns arise',
      '- Complete ordered laboratory studies/imaging as directed',
      '- Call office with questions or if symptoms worsen',
    ].join('\n'),
  },
  {
    id: 'discussion',
    title: 'Discussion Notes',
    text: 'Total encounter time: 00:01. Patient was counseled on their current health status and treatment plan. All questions were answered to patient satisfaction. Patient verbalized understanding of the discussion and agreed with the proposed plan of care. Informed consent obtained for all procedures and treatments. Patient education materials provided as appropriate.',
  },
  { id: 'em', title: 'E&M Coding', text: '-' },
];

/** The transcript in the Figma sample */
export const sampleTranscript: TranscriptLine[] = [
  { time: '00:00:02', text: 'Um, so this is for Fauver Khalilah, date of birth 01/01/1980.' },
  { time: '00:00:08', text: 'Okay, so chief complaint, uh, the patient presents today for, um, follow-up examination and, uh, review of recent test results.' },
  {
    time: '00:00:18',
    text: 'So history of present illness. The patient is, uh, a pleasant individual who returns to the clinic for routine follow-up visit. Um, patient reports, you know, general improvement in overall condition since the last visit. Uh, no new concerns or complaints at this time.',
  },
  {
    time: '00:00:35',
    text: 'Review of systems. Constitutional, um, no fever, no chills, or weight changes. Cardiovascular, no chest pain, no palpitations. Respiratory, uh, no shortness of breath or cough. Gastrointestinal, um, normal bowel movements, no nausea or vomiting. And musculoskeletal, no joint pain or swelling.',
  },
  {
    time: '00:00:58',
    text: 'Physical examination. Vital signs, blood pressure is one twenty over eighty, heart rate seventy-two, temperature ninety-eight point six degrees Fahrenheit. General, patient appears well-nourished and in no acute distress. HEENT normocephalic, atraumatic. Cardiovascular, regular rate and rhythm, no murmurs. Respiratory, clear to auscultation bilaterally. Abdomen is soft, non-tender, non-distended.',
  },
  {
    time: '00:01:28',
    text: 'Assessment and plan. Number one, continue current medication regimen. Number two, follow-up in three months or as needed. Number three, patient instructed to contact clinic if any new symptoms develop. Number four, all questions answered to patient satisfaction.',
  },
  { time: '00:01:45', text: 'Patient agrees with the plan of care. End of dictation.' },
];
