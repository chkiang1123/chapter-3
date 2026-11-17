import { MAX_CLASS_NUMBER, S2_CLASSES } from './storage';

/**
 * Primary authorized teacher Google account emails (bootstrapped alongside
 * dynamic entries managed in Firestore /teacherAllowlist/{email}).
 */
export const PRIMARY_TEACHER_EMAILS = ['chkiang@skhbbss.edu.hk'] as const;

// Verbatim boundary constants synchronized with firebase-blueprint.json and firestore.rules
export const ID_MAX_LENGTH = 128;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 60;
export const EMAIL_MAX_LENGTH = 128;
export const QUESTION_ID_MAX_LENGTH = 40;
export const QUESTION_LABEL_MAX_LENGTH = 30;
export const PROMPT_EQ_MAX_LENGTH = 200;
export const WRONG_INPUT_MAX_LENGTH = 120;
export const MAX_WRONG_INPUTS = 30;
export const MAX_SEC1_DONE = 120;
export const MAX_SEC2_DONE = 60;
export const MAX_SEC3_DONE = 80;
export const TEACHER_NOTE_MAX_LENGTH = 100;

export const ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailAddress(email: string): boolean {
  const norm = normalizeEmail(email);
  return norm.length >= 5 && norm.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(norm);
}

export function isPrimaryTeacherEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const norm = normalizeEmail(email);
  return (PRIMARY_TEACHER_EMAILS as readonly string[]).includes(norm);
}

export function clampText(value: string, maxLen: number, fallback = '–'): string {
  const trimmed = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

export function clampInt(value: number, min: number, max: number): number {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function clampClass(cls: string): (typeof S2_CLASSES)[number] {
  return (S2_CLASSES as readonly string[]).includes(cls)
    ? (cls as (typeof S2_CLASSES)[number])
    : '2A';
}

export function clampClassNo(classNo: number): number {
  return clampInt(classNo, 1, MAX_CLASS_NUMBER);
}

export function clampStringArray(items: string[], maxItems: number, maxItemLen: number): string[] {
  return items
    .map((item) => String(item ?? '').trim().slice(0, maxItemLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function sanitizeAttemptDocId(rawId: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, ID_MAX_LENGTH);
  return cleaned || `att_${Date.now()}`;
}
