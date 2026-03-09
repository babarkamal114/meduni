export type LearningCardType = 'Module' | 'Case Study';

export interface LearningCardItem {
  id: string;
  type: LearningCardType;
  title: string;
  description: string;
  meta: string;
  progress: number;
  progressLabel: string;
  cta: 'Continue' | 'Start';
  ctaVariant?: 'primary' | 'secondary';
  href: string;
}

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  body: string;
  hasVideo?: boolean;
  videoDuration?: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  lessons: LessonItem[];
  progress: number;
  progressLabel: string;
}

export interface CaseStudyStep {
  id: string;
  title: string;
  narrative: string;
  choices: { id: string; label: string; nextStepId: string; correct?: boolean }[];
}

export interface CaseStudyItem {
  id: string;
  title: string;
  description: string;
  steps: CaseStudyStep[];
  outcome: { title: string; body: string };
}

export type ContentType = 'pdf' | 'quiz' | 'video';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  meta: string;
  estimatedTime?: string;
  downloadUrl?: string;
  videoUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; correct: boolean }[];
}

export interface ContentQuizItem extends ContentItem {
  type: 'quiz';
  questions: QuizQuestion[];
}

export const MODULES: ModuleItem[] = [
  {
    id: 'cardiology',
    title: 'Cardiology Fundamentals',
    description:
      'ECG interpretation, heart failure management, and arrhythmia recognition.',
    progress: 80,
    progressLabel: '80% complete',
    lessons: [
      {
        id: '1',
        title: 'Introduction to ECG',
        duration: '12 min',
        completed: true,
        body: 'Electrocardiography (ECG) records the electrical activity of the heart. Key components include the P wave (atrial depolarisation), QRS complex (ventricular depolarisation), and T wave (ventricular repolarisation). Always check rate, rhythm, axis, and look for ischaemic changes.',
        hasVideo: true,
        videoDuration: '10 min',
      },
      {
        id: '2',
        title: 'Heart Failure Overview',
        duration: '18 min',
        completed: true,
        body: 'Heart failure is a clinical syndrome of breathlessness, fatigue, and fluid retention. Classify by ejection fraction (HFrEF, HFmrEF, HFpEF) and by NYHA class. First-line therapy includes ACE-i/ARNI, beta-blockers, MRA, and SGLT2 inhibitors where indicated.',
        hasVideo: true,
        videoDuration: '15 min',
      },
      {
        id: '3',
        title: 'Arrhythmia Recognition',
        duration: '15 min',
        completed: true,
        body: 'Recognise common arrhythmias: AF (irregularly irregular, no P waves), VT (broad QRS, rate >100), SVT (narrow QRS, regular). Management depends on stability: unstable patients need synchronised cardioversion; stable AF may be rate or rhythm controlled.',
        hasVideo: true,
        videoDuration: '12 min',
      },
      {
        id: '4',
        title: 'Acute Coronary Syndromes',
        duration: '20 min',
        completed: true,
        body: 'ACS includes STEMI, NSTEMI, and unstable angina. STEMI: ST elevation in two contiguous leads; activate primary PCI. NSTEMI: troponin rise with ischaemic symptoms; risk-stratify with GRACE score and consider early invasive strategy.',
        hasVideo: true,
        videoDuration: '18 min',
      },
      {
        id: '5',
        title: 'Case Review and Summary',
        duration: '10 min',
        completed: false,
        body: 'Summary of key points: systematic ECG interpretation, heart failure classification and treatment, arrhythmia recognition and acute management, and ACS pathways. Complete the short quiz to consolidate.',
        hasVideo: false,
      },
    ],
  },
  {
    id: 'neurology',
    title: 'Neurology Essentials',
    description:
      'Stroke assessment, headache differential diagnosis, and seizure management.',
    progress: 50,
    progressLabel: '50% complete',
    lessons: [
      {
        id: '1',
        title: 'Acute Stroke Assessment',
        duration: '14 min',
        completed: true,
        body: 'Time is brain. Use FAST (Face, Arms, Speech, Time). If within thrombolysis window, exclude contraindications and consider alteplase. NIHSS documents severity. Arrange urgent CT/MRI and stroke team review.',
        hasVideo: true,
        videoDuration: '12 min',
      },
      {
        id: '2',
        title: 'Headache Red Flags',
        duration: '12 min',
        completed: true,
        body: 'Red flags: sudden onset (thunderclap), worst ever, fever, focal neurology, papilloedema, age >50 new headache, immunosuppression. Consider SAH, space-occupying lesion, meningitis, temporal arteritis.',
        hasVideo: true,
        videoDuration: '10 min',
      },
      {
        id: '3',
        title: 'Seizure First Aid and Status',
        duration: '16 min',
        completed: true,
        body: 'First aid: safety, don’t restrain, time the seizure. Status epilepticus: seizure >5 min or repeated without recovery. Give benzodiazepine (e.g. lorazepam IV), then second-line (e.g. phenytoin/levetiracetam), then anaesthetic support.',
        hasVideo: true,
        videoDuration: '14 min',
      },
      {
        id: '4',
        title: 'Differential Diagnosis of Headache',
        duration: '15 min',
        completed: false,
        body: 'Primary: migraine, tension-type, cluster. Secondary: exclude serious causes. Migraine: unilateral, pulsating, nausea, photophobia. Tension-type: bilateral, pressing. Cluster: severe unilateral periorbital, autonomic features.',
        hasVideo: true,
        videoDuration: '12 min',
      },
      {
        id: '5',
        title: 'Stroke Thrombolysis and Thrombectomy',
        duration: '18 min',
        completed: false,
        body: 'Alteplase within 4.5 h in eligible patients. Thrombectomy for large-vessel occlusion within 6–24 h in selected patients. Monitor for haemorrhagic transformation and manage BP per protocol.',
        hasVideo: true,
        videoDuration: '16 min',
      },
      {
        id: '6',
        title: 'Epilepsy Follow-up',
        duration: '10 min',
        completed: false,
        body: 'After first seizure: driver advice, safety advice, consider EEG and MRI. Start antiepileptic only after discussion. Aim for seizure freedom with minimum side effects; consider withdrawal after 2 years if appropriate.',
        hasVideo: false,
      },
    ],
  },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'chest-pain',
    title: 'Chest Pain in A&E',
    description:
      'Interactive case: 45-year-old male presenting with acute chest pain. Decide next steps.',
    steps: [
      {
        id: 'presentation',
        title: 'Presentation',
        narrative:
          'A 45-year-old man presents to A&E with central chest pain lasting 2 hours. He describes it as tight and crushing, radiating to his left arm. He is sweaty and short of breath. What is your first priority?',
        choices: [
          {
            id: 'abc',
            label: 'ABC assessment, oxygen if SpO2 <94%, IV access, ECG within 10 min',
            nextStepId: 'ecg',
            correct: true,
          },
          {
            id: 'troponin',
            label: 'Order troponin and CXR first',
            nextStepId: 'delay',
          },
          {
            id: 'history',
            label: 'Take full history before any investigations',
            nextStepId: 'delay',
          },
        ],
      },
      {
        id: 'ecg',
        title: 'ECG',
        narrative:
          'ECG shows ST elevation in leads V2–V4. The patient is stable. What do you do next?',
        choices: [
          {
            id: 'pci',
            label: 'Activate primary PCI and give aspirin 300 mg + anticoagulation',
            nextStepId: 'outcome',
            correct: true,
          },
          {
            id: 'thrombolysis',
            label: 'Give thrombolysis (no PCI available within 90 min)',
            nextStepId: 'outcome',
          },
          {
            id: 'wait',
            label: 'Wait for troponin before deciding',
            nextStepId: 'delay',
          },
        ],
      },
      {
        id: 'delay',
        title: 'Delay',
        narrative:
          'Delaying ECG or reperfusion in suspected STEMI increases mortality. Return to the case and choose the time-critical actions.',
        choices: [
          { id: 'back', label: 'Back to presentation', nextStepId: 'presentation' },
        ],
      },
      {
        id: 'outcome',
        title: 'Outcome',
        narrative: '',
        choices: [],
      },
    ],
    outcome: {
      title: 'Well done',
      body: 'You identified a STEMI and activated the correct pathway. The patient was transferred for primary PCI. Early reperfusion saves myocardium and improves outcomes.',
    },
  },
];

export const CONTENT_ITEMS: (ContentItem | ContentQuizItem)[] = [
  {
    id: 'week-pdf-acs',
    type: 'pdf',
    title: 'Week 12: Acute Coronary Syndromes',
    description: 'PDF · 24 pages · Published 2 days ago',
    meta: 'PDF · 24 pages · Published 2 days ago',
    estimatedTime: '24 pages',
    downloadUrl: '#',
  },
  {
    id: 'week-quiz-pharma',
    type: 'quiz',
    title: 'Quiz: Pharmacology — Anti-hypertensives',
    description: '20 questions · 15 min · Published 4 days ago',
    meta: '20 questions · 15 min · Published 4 days ago',
    estimatedTime: '15 min',
    questions: [
      {
        id: 'q1',
        question: 'First-line antihypertensive in uncomplicated hypertension (no compelling indication) often includes:',
        options: [
          { id: 'a', label: 'ACE inhibitor or ARB', correct: true },
          { id: 'b', label: 'Alpha-blocker', correct: false },
          { id: 'c', label: 'Loop diuretic only', correct: false },
          { id: 'd', label: 'Central agonist', correct: false },
        ],
      },
      {
        id: 'q2',
        question: 'In heart failure with reduced EF, which drug class is first-line alongside ACE-i and beta-blockers?',
        options: [
          { id: 'a', label: 'CCB', correct: false },
          { id: 'b', label: 'MRA (e.g. spironolactone)', correct: true },
          { id: 'c', label: 'Thiazide only', correct: false },
          { id: 'd', label: 'Alpha-blocker', correct: false },
        ],
      },
      {
        id: 'q3',
        question: 'Contraindication to ACE inhibitors includes:',
        options: [
          { id: 'a', label: 'Previous MI', correct: false },
          { id: 'b', label: 'Bilateral renal artery stenosis', correct: true },
          { id: 'c', label: 'Diabetes', correct: false },
          { id: 'd', label: 'Hypertension', correct: false },
        ],
      },
      {
        id: 'q4',
        question: 'SGLT2 inhibitors in heart failure have been shown to:',
        options: [
          { id: 'a', label: 'Increase hospitalisation', correct: false },
          { id: 'b', label: 'Reduce cardiovascular death and HF hospitalisation', correct: true },
          { id: 'c', label: 'Replace ACE inhibitors', correct: false },
          { id: 'd', label: 'Be contraindicated in diabetes', correct: false },
        ],
      },
      {
        id: 'q5',
        question: 'First-line for hypertensive emergency (severe BP with end-organ damage) typically involves:',
        options: [
          { id: 'a', label: 'Rapid oral loading', correct: false },
          { id: 'b', label: 'IV therapy with controlled reduction (e.g. labetalol, GTN)', correct: true },
          { id: 'c', label: 'No treatment until outpatient review', correct: false },
          { id: 'd', label: 'Immediate halving of BP', correct: false },
        ],
      },
    ],
  },
  {
    id: 'week-video-suturing',
    type: 'video',
    title: 'Video: Suturing Techniques Tutorial',
    description: 'Video · 28 min · Published 1 week ago',
    meta: 'Video · 28 min · Published 1 week ago',
    estimatedTime: '28 min',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
];

export const LEARNING_CARDS: LearningCardItem[] = [
  {
    id: 'cardiology',
    type: 'Module',
    title: MODULES[0].title,
    description: MODULES[0].description,
    meta: '4/5 lessons',
    progress: 80,
    progressLabel: '80% complete',
    cta: 'Continue',
    href: '/dashboard/learning/module/cardiology',
  },
  {
    id: 'neurology',
    type: 'Module',
    title: MODULES[1].title,
    description: MODULES[1].description,
    meta: '3/6 lessons',
    progress: 50,
    progressLabel: '50% complete',
    cta: 'Continue',
    href: '/dashboard/learning/module/neurology',
  },
  {
    id: 'chest-pain',
    type: 'Case Study',
    title: CASE_STUDIES[0].title,
    description: CASE_STUDIES[0].description,
    meta: 'New',
    progress: 0,
    progressLabel: 'Not started',
    cta: 'Start',
    ctaVariant: 'primary',
    href: '/dashboard/learning/case-study/chest-pain',
  },
];

export const WEEKLY_MATERIALS: (ContentItem | ContentQuizItem)[] = [
  CONTENT_ITEMS[0],
  CONTENT_ITEMS[1],
  CONTENT_ITEMS[2],
];

export function getModuleById(moduleId: string): ModuleItem | undefined {
  return MODULES.find((mod) => mod.id === moduleId);
}

export function getCaseStudyById(id: string): CaseStudyItem | undefined {
  return CASE_STUDIES.find((c) => c.id === id);
}

export function getContentById(id: string): ContentItem | ContentQuizItem | undefined {
  return CONTENT_ITEMS.find((c) => c.id === id);
}

export function getLesson(moduleId: string, lessonId: string): LessonItem | undefined {
  const mod = getModuleById(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function getModuleLessonIds(moduleId: string): string[] {
  const mod = getModuleById(moduleId);
  return mod?.lessons.map((l) => l.id) ?? [];
}
