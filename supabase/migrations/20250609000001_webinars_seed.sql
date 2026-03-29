-- Seed two initial webinars (run after 20250609000000_webinars.sql)
INSERT INTO webinars (
  slug,
  title,
  expert,
  discipline,
  outcomes,
  duration,
  price,
  status,
  status_label,
  has_replay,
  scheduled_at
) VALUES
(
  'sudden-death-cardiac-causes',
  'Sudden Death Due to Cardiac Causes',
  'Dr Ahmed, UK-NHS Consultant Cardiologist',
  'Cardiology',
  '["Identify high-risk patients","Recognize arrhythmias","Manage emergencies","Case-based OSCE review"]'::jsonb,
  'TBA',
  'TBA',
  'upcoming',
  'Sat, 2nd May 2026',
  false,
  '2026-05-02T18:00:00.000Z'::timestamptz
),
(
  'inguinal-hernia-assessment-management',
  'Inguinal Hernia: Assessment & Management',
  'Dr Khalid Bashir, ER Senior Consultant',
  'Emergency',
  '["Anatomy and pathophysiology","Complicated vs uncomplicated cases","Surgical and conservative management","OSCE relevance"]'::jsonb,
  'TBA',
  'TBA',
  'upcoming',
  'Sat, 30th May 2026',
  false,
  '2026-05-30T18:00:00.000Z'::timestamptz
)
ON CONFLICT (slug) DO NOTHING;
