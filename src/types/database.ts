// This file will be auto-generated from Supabase schema
// Run: npx supabase gen types typescript --local > src/types/database.ts
// Or: npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
// Types below are manually maintained for webinars and webinar_registrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WebinarStatus = 'live' | 'upcoming' | 'recorded';

export interface WebinarsRow {
  id: string;
  slug: string;
  title: string;
  expert: string | null;
  discipline: string | null;
  outcomes: Json;
  duration: string | null;
  price: string | null;
  status: WebinarStatus;
  status_label: string | null;
  has_replay: boolean;
  scheduled_at: string | null;
  join_url: string | null;
  replay_url: string | null;
  zoom_webinar_id: string | null;
  zoom_host_id: string | null;
  zoom_start_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebinarsInsert {
  id?: string;
  slug: string;
  title: string;
  expert?: string | null;
  discipline?: string | null;
  outcomes?: Json;
  duration?: string | null;
  price?: string | null;
  status?: WebinarStatus;
  status_label?: string | null;
  has_replay?: boolean;
  scheduled_at?: string | null;
  join_url?: string | null;
  replay_url?: string | null;
  zoom_webinar_id?: string | null;
  zoom_host_id?: string | null;
  zoom_start_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WebinarsUpdate {
  slug?: string;
  title?: string;
  expert?: string | null;
  discipline?: string | null;
  outcomes?: Json;
  duration?: string | null;
  price?: string | null;
  status?: WebinarStatus;
  status_label?: string | null;
  has_replay?: boolean;
  scheduled_at?: string | null;
  join_url?: string | null;
  replay_url?: string | null;
  zoom_webinar_id?: string | null;
  zoom_host_id?: string | null;
  zoom_start_url?: string | null;
  updated_at?: string;
}

export interface WebinarRegistrationsRow {
  id: string;
  user_id: string;
  webinar_id: string;
  stripe_payment_intent_id: string | null;
  zoom_registrant_id: string | null;
  zoom_join_url: string | null;
  zoom_registered_at: string | null;
  created_at: string;
}

export interface WebinarRegistrationsInsert {
  id?: string;
  user_id: string;
  webinar_id: string;
  stripe_payment_intent_id?: string | null;
  zoom_registrant_id?: string | null;
  zoom_join_url?: string | null;
  zoom_registered_at?: string | null;
  created_at?: string;
}

export interface EmailPreferencesRow {
  user_id: string;
  marketing_emails: boolean;
  purchase_emails: boolean;
  updated_at: string;
}

export interface ProfilesRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailVerificationTokensRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface EmailVerificationTokensInsert {
  id?: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at?: string;
}

export interface LearningModulesRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  pass_threshold_percent?: number;
  created_at: string;
  updated_at: string;
}

export interface LearningLessonsRow {
  id: string;
  module_id: string;
  title: string;
  duration: string | null;
  body: string | null;
  has_video: boolean;
  video_url: string | null;
  video_duration: string | null;
  lesson_type?: 'content' | 'quiz';
  quiz_questions?: Json | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LearningCaseStudiesRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  outcome_title: string | null;
  outcome_body: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LearningCaseStudyStepsRow {
  id: string;
  case_study_id: string;
  step_key: string;
  title: string;
  narrative: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LearningCaseStudyChoicesRow {
  id: string;
  step_id: string;
  label: string;
  next_step_key: string;
  correct: boolean | null;
  sort_order: number;
  created_at: string;
}

export interface LearningContentItemsRow {
  id: string;
  type: string;
  title: string;
  description: string | null;
  meta: string | null;
  estimated_time: string | null;
  download_url: string | null;
  video_url: string | null;
  quiz_questions: Json;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserLessonCompletionsRow {
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface UserQuizAttemptsRow {
  id: string;
  user_id: string;
  lesson_id: string;
  score_percent: number;
  passed: boolean;
  completed_at: string;
}

export interface UserModuleCertificationsRow {
  user_id: string;
  module_id: string;
  certified_at: string;
  share_token: string | null;
}

export interface UserContentQuizAttemptsRow {
  id: string;
  user_id: string;
  content_item_id: string;
  score_percent: number;
  passed: boolean;
  completed_at: string;
}

export type NotificationType = 'webinar' | 'module' | 'lesson' | 'content' | 'case_study';

export interface NotificationsRow {
  id: string;
  type: NotificationType;
  title: string;
  link: string;
  reference_id: string | null;
  created_at: string;
}

export interface NotificationReadsRow {
  user_id: string;
  notification_id: string;
  read_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: Omit<ProfilesRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProfilesRow>;
      };
      webinars: {
        Row: WebinarsRow;
        Insert: WebinarsInsert;
        Update: WebinarsUpdate;
      };
      webinar_registrations: {
        Row: WebinarRegistrationsRow;
        Insert: WebinarRegistrationsInsert;
        Update: Partial<WebinarRegistrationsRow>;
      };
      email_verification_tokens: {
        Row: EmailVerificationTokensRow;
        Insert: EmailVerificationTokensInsert;
        Update: Partial<EmailVerificationTokensRow>;
      };
      learning_modules: { Row: LearningModulesRow; Insert: Partial<LearningModulesRow>; Update: Partial<LearningModulesRow> };
      learning_lessons: { Row: LearningLessonsRow; Insert: Partial<LearningLessonsRow>; Update: Partial<LearningLessonsRow> };
      learning_case_studies: { Row: LearningCaseStudiesRow; Insert: Partial<LearningCaseStudiesRow>; Update: Partial<LearningCaseStudiesRow> };
      learning_case_study_steps: { Row: LearningCaseStudyStepsRow; Insert: Partial<LearningCaseStudyStepsRow>; Update: Partial<LearningCaseStudyStepsRow> };
      learning_case_study_choices: { Row: LearningCaseStudyChoicesRow; Insert: Partial<LearningCaseStudyChoicesRow>; Update: Partial<LearningCaseStudyChoicesRow> };
      learning_content_items: { Row: LearningContentItemsRow; Insert: Partial<LearningContentItemsRow>; Update: Partial<LearningContentItemsRow> };
      user_lesson_completions: { Row: UserLessonCompletionsRow; Insert: Partial<UserLessonCompletionsRow>; Update: Partial<UserLessonCompletionsRow> };
      user_quiz_attempts: { Row: UserQuizAttemptsRow; Insert: Partial<UserQuizAttemptsRow>; Update: Partial<UserQuizAttemptsRow> };
      user_module_certifications: { Row: UserModuleCertificationsRow; Insert: Partial<UserModuleCertificationsRow>; Update: Partial<UserModuleCertificationsRow> };
      user_content_quiz_attempts: { Row: UserContentQuizAttemptsRow; Insert: Partial<UserContentQuizAttemptsRow>; Update: Partial<UserContentQuizAttemptsRow> };
      notifications: { Row: NotificationsRow; Insert: Partial<NotificationsRow>; Update: Partial<NotificationsRow> };
      notification_reads: { Row: NotificationReadsRow; Insert: Partial<NotificationReadsRow>; Update: Partial<NotificationReadsRow> };
      email_preferences: { Row: EmailPreferencesRow; Insert: Partial<EmailPreferencesRow>; Update: Partial<EmailPreferencesRow> };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
