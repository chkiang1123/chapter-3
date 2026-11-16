/**
 * Balance Quest — S1 Linear Equations (Google Apps Script web app)
 *
 * Deploy: Deploy ▸ New deployment ▸ Web app
 *   Execute as:        Me
 *   Who has access:    Anyone within skhbbss.edu.hk
 * Students open the web app URL. Teachers open the same URL with  ?page=teacher  added.
 * All data is stored in a Google Sheet that is created automatically the first time the app runs.
 */
var CONFIG = {
  APP_TITLE: 'Balance Quest · S1 Linear Equations',
  ALLOWED_DOMAIN: 'skhbbss.edu.hk',
  // The account that owns and deploys this script is always a teacher. Add any other teachers here.
  TEACHER_EMAILS: [],
  // Classes students can choose from. The form is the number at the start (1A → S1).
  CLASSES: ['1A', '1B', '1C', '1D', '1E'],
  MAX_CLASS_NUMBER: 45,
  CLASS_TOP: 10,
  FORM_TOP: 20,
  // Leave blank: a spreadsheet is created automatically and remembered.
  SPREADSHEET_ID: ''
};

var STUDENT_HEADERS = ['Email', 'Name', 'Class', 'Class No', 'Form', 'Score', 'Questions Done', 'Similar Done',
  'Wrong Attempts', 'Hints Used', 'Status', 'Current Question', 'First Login', 'Last Active', 'Score Updated',
  'Completed At', 'State'];
var RESULT_HEADERS = ['Timestamp', 'Email', 'Name', 'Class', 'Class No', 'Question', 'Type', 'Version', 'Equation',
  'Points', 'Max Points', 'Steps', 'Wrong Moves', 'Wrong Lines', 'Hints', 'Skipped Steps', 'Seconds', 'Wrong Answers', 'Attempt ID'];
var COL = {};
STUDENT_HEADERS.forEach(function (h, i) { COL[h] = i; });

// ── Web app entry ─────────────────────────────────────────────────────
function doGet(e) {
  var page = e && e.parameter && e.parameter.page;
  var template;
  if (page === 'teacher') {
    template = HtmlService.createTemplateFromFile('Teacher');
  } else {
    template = HtmlService.createTemplateFromFile('Index');
  }
  template.bankJson = JSON.stringify(QUESTION_BANK);
  template.appJson = JSON.stringify({
    title: CONFIG.APP_TITLE, classes: CONFIG.CLASSES, maxClassNumber: CONFIG.MAX_CLASS_NUMBER,
    studentUrl: appUrl_()
  });
  return template.evaluate()
    .setTitle(CONFIG.APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function appUrl_() {
  try { return ScriptApp.getService().getUrl() || ''; } catch (e) { return ''; }
}

// ── Who is signed in ──────────────────────────────────────────────────
function currentEmail_() {
  return String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
}

function isTeacherEmail_(email) {
  if (!email) return false;
  var owner = '';
  try { owner = String(Session.getEffectiveUser().getEmail() || '').toLowerCase(); } catch (e) { owner = ''; }
  if (owner && email === owner) return true;
  return CONFIG.TEACHER_EMAILS.map(function (t) { return String(t).toLowerCase(); }).indexOf(email) >= 0;
}

function requireUser_() {
  var email = currentEmail_();
  if (!email) {
    throw new Error('Please sign in with your school Google account (@' + CONFIG.ALLOWED_DOMAIN + ') and open this page again.');
  }
  var domainOk = email.slice(-(CONFIG.ALLOWED_DOMAIN.length + 1)) === '@' + CONFIG.ALLOWED_DOMAIN;
  if (!domainOk && !isTeacherEmail_(email)) {
    throw new Error('You are signed in as ' + email + '. Please switch to your school Google account (@' + CONFIG.ALLOWED_DOMAIN + ').');
  }
  return email;
}

function requireTeacher_() {
  var email = requireUser_();
  if (!isTeacherEmail_(email)) throw new Error('This page is for teachers only.');
  return email;
}

// ── Storage ───────────────────────────────────────────────────────────
function db_() {
  var props = PropertiesService.getScriptProperties();
  var id = CONFIG.SPREADSHEET_ID || props.getProperty('SPREADSHEET_ID');
  var ss = null;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('Balance Quest – S1 Linear Equations (student progress)');
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }
  var students = ensureSheet_(ss, 'Students', STUDENT_HEADERS);
  var results = ensureSheet_(ss, 'Results', RESULT_HEADERS);
  var extra = ss.getSheetByName('Sheet1');
  if (extra && ss.getSheets().length > 2 && extra.getLastRow() === 0) ss.deleteSheet(extra);
  return { ss: ss, students: students, results: results };
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readStudents_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, STUDENT_HEADERS.length).getValues();
}

function findStudentRow_(rows, email) {
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][COL['Email']]).toLowerCase() === email) return i;
  }
  return -1;
}

function parseState_(text) {
  var state;
  try { state = JSON.parse(text || '{}'); } catch (e) { state = {}; }
  if (typeof state.pos !== 'number') state.pos = 0;
  if (!state.pending) state.pending = null;
  if (!state.attempts) state.attempts = [];
  return state;
}

/** The 4 versions of a round: the original question and its 3 similar questions. */
function versionsOf_(item) {
  return [item.id].concat(item.sims.map(function (_, k) { return item.id + '#s' + (k + 1); }));
}

function randomFrom_(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/** Make sure every round has a randomly chosen version. Returns true if anything changed. */
function ensurePicks_(state) {
  var changed = false;
  if (!Array.isArray(state.picks) || state.picks.length !== QUESTION_BANK.length) { state.picks = []; changed = true; }
  QUESTION_BANK.forEach(function (item, i) {
    if (versionsOf_(item).indexOf(state.picks[i]) < 0) { state.picks[i] = randomFrom_(versionsOf_(item)); changed = true; }
  });
  return changed;
}

function freshState_() {
  var state = { pos: 0, pending: null, attempts: [] };
  ensurePicks_(state);
  return state;
}

function formOf_(cls) {
  var m = String(cls || '').match(/^\s*(\d+)/);
  return m ? 'S' + m[1] : String(cls || '');
}

function nowText_() {
  return new Date(); // stored as a real date in the sheet
}

function timeText_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone() || 'Asia/Hong_Kong', 'yyyy-MM-dd HH:mm');
  return String(value || '');
}

function timeValue_(value) {
  if (value instanceof Date) return value.getTime();
  var t = Date.parse(String(value || ''));
  return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

function publicStudent_(row) {
  var state = parseState_(row[COL['State']]);
  return {
    email: row[COL['Email']], name: row[COL['Name']], cls: row[COL['Class']], classNo: Number(row[COL['Class No']]) || '',
    form: row[COL['Form']], score: Number(row[COL['Score']]) || 0, done: Number(row[COL['Questions Done']]) || 0,
    extraDone: Number(row[COL['Similar Done']]) || 0, status: row[COL['Status']],
    state: { pos: state.pos, pending: state.pending, roundId: state.picks && state.pos < state.picks.length ? state.picks[state.pos] : null }
  };
}

// ── Question bank helpers ─────────────────────────────────────────────
function mainIds_() { return QUESTION_BANK.map(function (q) { return q.id; }); }
function bankItem_(id) {
  var mainId = String(id).split('#s')[0];
  for (var i = 0; i < QUESTION_BANK.length; i++) if (QUESTION_BANK[i].id === mainId) return QUESTION_BANK[i];
  return null;
}
function questionLabel_(id) {
  var item = bankItem_(id);
  if (!item) return id;
  var label = 'Example ' + item.example + (item.part ? ' (' + item.part + ')' : '');
  return String(id).indexOf('#s') >= 0 ? label + ' · similar ' + id.split('#s')[1] : label;
}
function versionData_(id) {
  var item = bankItem_(id);
  var parts = String(id).split('#s');
  return parts.length > 1 ? item.sims[Number(parts[1]) - 1] : item;
}
function versionName_(id) {
  var parts = String(id).split('#s');
  return parts.length > 1 ? 'Similar ' + parts[1] : 'Original';
}
function questionEquation_(id) {
  var item = bankItem_(id);
  if (!item) return '';
  var parts = String(id).split('#s');
  return parts.length > 1 ? item.sims[Number(parts[1]) - 1].eq : item.eq;
}

// ── Student API (called from Index.html) ──────────────────────────────
function getBootstrap() {
  var email = requireUser_();
  var d = db_();
  var rows = readStudents_(d.students);
  var index = findStudentRow_(rows, email);
  if (index >= 0) {
    var st = parseState_(rows[index][COL['State']]);
    if (ensurePicks_(st)) {
      rows[index][COL['State']] = JSON.stringify(st);
      d.students.getRange(index + 2, COL['State'] + 1).setValue(rows[index][COL['State']]);
    }
  }
  var url = appUrl_();
  return {
    email: email,
    isTeacher: isTeacherEmail_(email),
    teacherUrl: url ? url + '?page=teacher' : '?page=teacher',
    student: index >= 0 ? publicStudent_(rows[index]) : null
  };
}

function saveProfile(profile) {
  var email = requireUser_();
  var name = String(profile && profile.name || '').replace(/\s+/g, ' ').trim().replace(/^[=+\-@]+/, '').trim().slice(0, 40);
  var cls = String(profile && profile.cls || '').trim();
  var classNo = Number(profile && profile.classNo);
  if (!name) throw new Error('Please enter your full name.');
  if (CONFIG.CLASSES.indexOf(cls) < 0) throw new Error('Please choose your class.');
  if (!(classNo >= 1 && classNo <= CONFIG.MAX_CLASS_NUMBER && Math.floor(classNo) === classNo)) {
    throw new Error('Please enter a class number from 1 to ' + CONFIG.MAX_CLASS_NUMBER + '.');
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = db_();
    var rows = readStudents_(d.students);
    var index = findStudentRow_(rows, email);
    var now = nowText_();
    var row;
    if (index < 0) {
      row = [email, name, cls, classNo, formOf_(cls), 0, 0, 0, 0, 0, 'Not started', questionLabel_(QUESTION_BANK[0].id),
        now, now, '', '', JSON.stringify(freshState_())];
      d.students.appendRow(row);
    } else {
      row = rows[index];
      row[COL['Name']] = name;
      row[COL['Class']] = cls;
      row[COL['Class No']] = classNo;
      row[COL['Form']] = formOf_(cls);
      row[COL['Last Active']] = now;
      d.students.getRange(index + 2, 1, 1, STUDENT_HEADERS.length).setValues([row]);
    }
    return publicStudent_(row);
  } finally {
    lock.releaseLock();
  }
}

/** Save one finished question and move the student on. */
function recordResult(r) {
  var email = requireUser_();
  r = r || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = db_();
    var rows = readStudents_(d.students);
    var index = findStudentRow_(rows, email);
    if (index < 0) throw new Error('Please enter your name and class first.');
    var row = rows[index];
    var state = parseState_(row[COL['State']]);
    var attemptId = String(r.attemptId || '').slice(0, 40);
    // A repeated save (e.g. after a network retry) is ignored.
    if (attemptId && state.attempts.indexOf(attemptId) >= 0) return publicStudent_(row);

    var ids = mainIds_();
    var qid = String(r.qid || '');
    var item = bankItem_(qid);
    if (!item) throw new Error('Unknown question.');
    ensurePicks_(state);
    var isExtra = !!state.pending;
    if (isExtra) {
      if (state.pending.extraId !== qid) throw new Error('This question is not the next one. Please reload the page.');
    } else {
      if (state.pos >= ids.length || state.picks[state.pos] !== qid) throw new Error('This question is not the next one. Please reload the page.');
    }
    var version = versionData_(qid);

    var maxPoints = isExtra ? 0 : version.steps.length * 10;
    var points = Math.max(0, Math.min(maxPoints, Math.round(Number(r.points) || 0)));
    var wrongMoves = clampInt_(r.wrongMoves, 0, 999);
    var wrongLines = clampInt_(r.wrongLines, 0, 999);
    var hints = clampInt_(r.hints, 0, 999);
    var hadError = !!r.hadError || wrongMoves + wrongLines > 0;
    var now = nowText_();

    if (isExtra) {
      state.pending = null;
      row[COL['Similar Done']] = (Number(row[COL['Similar Done']]) || 0) + 1;
    } else {
      state.pos += 1;
      if (hadError) {
        var others = versionsOf_(item).filter(function (v) { return v !== qid; });
        state.pending = { forId: qid, extraId: randomFrom_(others) };
      }
    }
    state.attempts.push(attemptId);
    if (state.attempts.length > 20) state.attempts = state.attempts.slice(-20);

    var finished = state.pos >= ids.length && !state.pending;
    row[COL['Score']] = (Number(row[COL['Score']]) || 0) + points;
    row[COL['Questions Done']] = state.pos;
    row[COL['Wrong Attempts']] = (Number(row[COL['Wrong Attempts']]) || 0) + wrongMoves + wrongLines;
    row[COL['Hints Used']] = (Number(row[COL['Hints Used']]) || 0) + hints;
    row[COL['Status']] = finished ? 'Completed' : 'In progress';
    row[COL['Current Question']] = finished ? '—' : (state.pending ? 'Similar question for ' + questionLabel_(state.pending.forId.split('#s')[0]) : questionLabel_(ids[state.pos]));
    row[COL['Last Active']] = now;
    if (points > 0) row[COL['Score Updated']] = now;
    if (finished && !row[COL['Completed At']]) row[COL['Completed At']] = now;
    row[COL['State']] = JSON.stringify(state);
    d.students.getRange(index + 2, 1, 1, STUDENT_HEADERS.length).setValues([row]);

    var wrongAnswers = (r.wrongInputs || []).slice(0, 12).map(function (x) { return String(x).slice(0, 80); }).join(' | ');
    d.results.appendRow([now, email, row[COL['Name']], row[COL['Class']], row[COL['Class No']], questionLabel_(item.id),
      isExtra ? 'Similar' : 'Main', versionName_(qid), "'" + questionEquation_(qid),
      points, maxPoints, clampInt_(r.pathSteps, 0, 50), wrongMoves, wrongLines, hints, clampInt_(r.skipped, 0, 50),
      clampInt_(r.seconds, 0, 86400), wrongAnswers, attemptId]);
    return publicStudent_(row);
  } finally {
    lock.releaseLock();
  }
}

function clampInt_(value, min, max) {
  var n = Math.round(Number(value) || 0);
  return Math.max(min, Math.min(max, n));
}

// ── Leaderboard ───────────────────────────────────────────────────────
function rankRows_(rows) {
  var list = rows.filter(function (r) { return r[COL['Email']] && r[COL['Class']]; }).map(function (r) {
    return {
      email: String(r[COL['Email']]).toLowerCase(), name: r[COL['Name']], cls: r[COL['Class']], classNo: r[COL['Class No']],
      form: r[COL['Form']] || formOf_(r[COL['Class']]), score: Number(r[COL['Score']]) || 0,
      done: Number(r[COL['Questions Done']]) || 0, updated: timeValue_(r[COL['Score Updated']])
    };
  });
  list.sort(function (a, b) {
    return b.score - a.score || b.done - a.done || a.updated - b.updated || String(a.name).localeCompare(String(b.name));
  });
  return list;
}

function withRanks_(list) {
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var prev = out[i - 1];
    var same = prev && prev.score === list[i].score && prev.done === list[i].done;
    out.push(Object.assign({}, list[i], { rank: same ? prev.rank : i + 1 }));
  }
  return out;
}

function board_(rows, cls, form, email) {
  var ranked = rankRows_(rows).filter(function (r) { return r.score > 0 || r.done > 0; });
  var classList = withRanks_(ranked.filter(function (r) { return r.cls === cls; }));
  var formList = withRanks_(ranked.filter(function (r) { return r.form === form; }));
  function shape(r) { return { rank: r.rank, name: r.name, cls: r.cls, classNo: r.classNo, score: r.score, done: r.done, isMe: r.email === email }; }
  var meClass = classList.filter(function (r) { return r.email === email; })[0];
  var meForm = formList.filter(function (r) { return r.email === email; })[0];
  return {
    cls: cls, form: form,
    classTop: classList.slice(0, CONFIG.CLASS_TOP).map(shape),
    formTop: formList.slice(0, CONFIG.FORM_TOP).map(shape),
    me: meClass ? { classRank: meClass.rank, formRank: meForm ? meForm.rank : null, score: meClass.score } : null
  };
}

function getLeaderboard(clsForTeacher) {
  var email = requireUser_();
  var rows = readStudents_(db_().students);
  var index = findStudentRow_(rows, email);
  var cls;
  if (clsForTeacher && isTeacherEmail_(email)) cls = clsForTeacher;
  else if (index >= 0) cls = rows[index][COL['Class']];
  else throw new Error('Please enter your name and class first.');
  return board_(rows, cls, formOf_(cls), email);
}

// ── Teacher API (called from Teacher.html) ────────────────────────────
function getTeacherData() {
  requireTeacher_();
  var d = db_();
  var rows = readStudents_(d.students);
  var students = rows.filter(function (r) { return r[COL['Email']]; }).map(function (r) {
    var s = publicStudent_(r);
    s.wrong = Number(r[COL['Wrong Attempts']]) || 0;
    s.hints = Number(r[COL['Hints Used']]) || 0;
    s.current = r[COL['Current Question']];
    s.firstLogin = timeText_(r[COL['First Login']]);
    s.lastActive = timeText_(r[COL['Last Active']]);
    s.completedAt = timeText_(r[COL['Completed At']]);
    return s;
  });
  var last = d.results.getLastRow();
  var results = last < 2 ? [] : d.results.getRange(2, 1, last - 1, RESULT_HEADERS.length).getValues().map(function (r) {
    return {
      time: timeText_(r[0]), email: String(r[1]).toLowerCase(), question: r[5], type: r[6], version: r[7], equation: String(r[8]),
      points: Number(r[9]) || 0, max: Number(r[10]) || 0, wrongMoves: Number(r[12]) || 0, wrongLines: Number(r[13]) || 0,
      hints: Number(r[14]) || 0, skipped: Number(r[15]) || 0, seconds: Number(r[16]) || 0, wrongAnswers: String(r[17] || '')
    };
  });
  return {
    students: students, results: results, classes: CONFIG.CLASSES,
    sheetUrl: d.ss.getUrl(), studentUrl: appUrl_(), teacher: currentEmail_()
  };
}

function resetStudent(email) {
  requireTeacher_();
  email = String(email || '').toLowerCase();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = db_();
    var rows = readStudents_(d.students);
    var index = findStudentRow_(rows, email);
    if (index < 0) throw new Error('Student not found.');
    var row = rows[index];
    row[COL['Score']] = 0;
    row[COL['Questions Done']] = 0;
    row[COL['Similar Done']] = 0;
    row[COL['Wrong Attempts']] = 0;
    row[COL['Hints Used']] = 0;
    row[COL['Status']] = 'Not started';
    row[COL['Current Question']] = questionLabel_(QUESTION_BANK[0].id);
    row[COL['Score Updated']] = '';
    row[COL['Completed At']] = '';
    row[COL['State']] = JSON.stringify(freshState_());
    d.students.getRange(index + 2, 1, 1, STUDENT_HEADERS.length).setValues([row]);
    // Remove this student's old results.
    var last = d.results.getLastRow();
    if (last >= 2) {
      var data = d.results.getRange(2, 1, last - 1, RESULT_HEADERS.length).getValues();
      var keep = data.filter(function (r) { return String(r[1]).toLowerCase() !== email; });
      if (keep.length !== data.length) {
        d.results.getRange(2, 1, last - 1, RESULT_HEADERS.length).clearContent();
        if (keep.length) d.results.getRange(2, 1, keep.length, RESULT_HEADERS.length).setValues(keep);
      }
    }
    return true;
  } finally {
    lock.releaseLock();
  }
}

/** Optional: run once from the editor to create the spreadsheet and print its link. */
function setup() {
  var d = db_();
  Logger.log('Progress spreadsheet: ' + d.ss.getUrl());
}
