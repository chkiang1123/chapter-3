import { S1_CH10_QUESTIONS, S2_CH3_QUESTIONS, getChapterIdForSection } from '../data/curriculum';
import type { CloudStudentSummary } from './firebaseSync';
import type { AttemptRecord } from './storage';

const SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export const SHEET_TABS = {
  SUMMARIES: 'Student Summaries',
  S1_PROGRESS: 'S1 Ch10 Progress',
  S2_PROGRESS: 'S2 Ch3 Progress',
  ATTEMPTS: 'Attempts Log',
} as const;

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheetNames: string[];
}

export interface SheetTabPayload {
  tabName: string;
  rows: (string | number)[][];
}

export interface SyncResult {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  tabsUpdated: string[];
  studentsWritten: number;
  attemptsWritten: number;
  syncedAtIso: string;
}

export function parseSpreadsheetId(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  if (/^[a-zA-Z0-9_-]{12,}$/.test(trimmed)) {
    return trimmed;
  }
  return '';
}

export function buildGoogleSheetTabsData(
  students: CloudStudentSummary[],
  attempts: AttemptRecord[],
): SheetTabPayload[] {
  const s1Total = S1_CH10_QUESTIONS.length;
  const s2Total = S2_CH3_QUESTIONS.length;

  const summaryHeader: (string | number)[] = [
    'Class',
    'Class No.',
    'Name',
    'Google Email',
    'S.1 Ch.10 Done',
    'S.1 Ch.10 Total',
    'S.1 Ch.10 Score',
    'S.2 Ch.3 Done',
    'S.2 Ch.3 Total',
    'S.2 Ch.3 Score',
    'Combined Done',
    'Combined Score',
    'Similar Qs',
    'Wrong Attempts',
    'Hints Used',
    'Last Updated (ISO)',
  ];

  const summaryRows = students.map((s) => [
    s.cls,
    s.classNo,
    s.name,
    s.email,
    s.doneCountS1C10,
    s1Total,
    s.scoreS1C10,
    s.doneCountS2C3,
    s2Total,
    s.scoreS2C3,
    s.doneCount,
    s.score,
    s.extraDone,
    s.wrongAttempts,
    s.hintsUsed,
    s.updatedAtIso,
  ]);

  const s1Header: (string | number)[] = [
    'Class',
    'Class No.',
    'Name',
    'Google Email',
    'Sec 1: Index Laws',
    'Sec 2: Polynomial Basics',
    'Sec 3: Add & Subtract Polynomials',
    'Sec 4: Multiply Polynomials',
    'S.1 Done',
    'S.1 Total',
    'S.1 Score',
  ];

  const s1Rows = students.map((s) => [
    s.cls,
    s.classNo,
    s.name,
    s.email,
    s.completedIdsS1C10Sec1.length,
    s.completedIdsS1C10Sec2.length,
    s.completedIdsS1C10Sec3.length,
    s.completedIdsS1C10Sec4.length,
    s.doneCountS1C10,
    s1Total,
    s.scoreS1C10,
  ]);

  const s2Header: (string | number)[] = [
    'Class',
    'Class No.',
    'Name',
    'Google Email',
    'Sec 1: Algebraic Fractions',
    'Sec 2: Formulas & Substitution',
    'Sec 3: Change of Subject',
    'S.2 Done',
    'S.2 Total',
    'S.2 Score',
  ];

  const s2Rows = students.map((s) => [
    s.cls,
    s.classNo,
    s.name,
    s.email,
    s.completedIdsSec1.length,
    s.completedIdsSec2.length,
    s.completedIdsSec3.length,
    s.doneCountS2C3,
    s2Total,
    s.scoreS2C3,
  ]);

  const attemptHeader: (string | number)[] = [
    'Timestamp',
    'Chapter',
    'Section',
    'Class',
    'Class No.',
    'Name',
    'Google Email',
    'Question',
    'Type',
    'Prompt',
    'Points',
    'Max Points',
    'Wrong Moves',
    'Wrong Lines',
    'Hints',
    'Duration (s)',
    'Wrong Inputs',
  ];

  const attemptRows = attempts.map((a) => {
    const ch = a.chapterId || getChapterIdForSection(a.sectionId);
    return [
      a.timestamp,
      ch === 's1-ch10' ? 'S.1 Ch.10' : 'S.2 Ch.3',
      a.sectionId,
      a.studentCls,
      a.studentClassNo,
      a.studentName,
      a.studentEmail,
      a.questionLabel,
      a.type,
      a.promptEq,
      a.points,
      a.maxPoints,
      a.wrongMoves,
      a.wrongLines,
      a.hints,
      a.seconds,
      a.wrongInputs.join(' | '),
    ];
  });

  return [
    { tabName: SHEET_TABS.SUMMARIES, rows: [summaryHeader, ...summaryRows] },
    { tabName: SHEET_TABS.S1_PROGRESS, rows: [s1Header, ...s1Rows] },
    { tabName: SHEET_TABS.S2_PROGRESS, rows: [s2Header, ...s2Rows] },
    { tabName: SHEET_TABS.ATTEMPTS, rows: [attemptHeader, ...attemptRows] },
  ];
}

async function sheetsFetchJson<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let msg = `Google Sheets request failed (HTTP ${response.status}).`;
    try {
      const body = (await response.json()) as { error?: { message?: string; status?: string } };
      if (body?.error?.message) {
        msg = body.error.message;
      }
    } catch {
      // ignore json parse error
    }
    if (response.status === 401) {
      throw new Error('Google Sheets session expired. Please reconnect Google Sheets authorization.');
    }
    if (response.status === 403) {
      throw new Error(`Google Sheets permission denied: ${msg}`);
    }
    if (response.status === 404) {
      throw new Error('Google Spreadsheet not found. Verify the Spreadsheet ID or URL.');
    }
    throw new Error(msg);
  }

  return (await response.json()) as T;
}

export async function inspectSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
): Promise<SheetMetadata> {
  const data = await sheetsFetchJson<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{ properties?: { title?: string } }>;
  }>(
    `${SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets.properties.title`,
    accessToken,
  );

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    spreadsheetUrl:
      data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    sheetNames: (data.sheets || [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)),
  };
}

export async function createTeacherSpreadsheet(
  accessToken: string,
  title = 'SKHBBSS Balance Quest · S.1 Ch.10 & S.2 Ch.3 Records',
): Promise<SheetMetadata> {
  const data = await sheetsFetchJson<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{ properties?: { title?: string } }>;
  }>(SHEETS_BASE_URL, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      properties: { title },
      sheets: [
        { properties: { title: SHEET_TABS.SUMMARIES } },
        { properties: { title: SHEET_TABS.S1_PROGRESS } },
        { properties: { title: SHEET_TABS.S2_PROGRESS } },
        { properties: { title: SHEET_TABS.ATTEMPTS } },
      ],
    }),
  });

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || title,
    spreadsheetUrl:
      data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    sheetNames: (data.sheets || [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)),
  };
}

function escapeSheetTitle(name: string): string {
  return `'${name.replace(/'/g, "''")}'`;
}

export async function syncAllDataToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  students: CloudStudentSummary[],
  attempts: AttemptRecord[],
): Promise<SyncResult> {
  const meta = await inspectSpreadsheet(accessToken, spreadsheetId);
  const tabsPayload = buildGoogleSheetTabsData(students, attempts);

  const missingTabs = tabsPayload
    .map((t) => t.tabName)
    .filter((name) => !meta.sheetNames.includes(name));

  if (missingTabs.length > 0) {
    await sheetsFetchJson(
      `${SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: missingTabs.map((title) => ({
            addSheet: { properties: { title } },
          })),
        }),
      },
    );
  }

  const clearRanges = tabsPayload.map((t) => `${escapeSheetTitle(t.tabName)}!A:Z`);
  await sheetsFetchJson(
    `${SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values:batchClear`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ ranges: clearRanges }),
    },
  );

  await sheetsFetchJson(
    `${SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: tabsPayload.map((t) => ({
          range: `${escapeSheetTitle(t.tabName)}!A1`,
          majorDimension: 'ROWS',
          values: t.rows,
        })),
      }),
    },
  );

  return {
    spreadsheetId: meta.spreadsheetId,
    spreadsheetTitle: meta.title,
    spreadsheetUrl: meta.spreadsheetUrl,
    tabsUpdated: tabsPayload.map((t) => t.tabName),
    studentsWritten: students.length,
    attemptsWritten: attempts.length,
    syncedAtIso: new Date().toISOString(),
  };
}
