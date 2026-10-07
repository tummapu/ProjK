const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Baby Logs';
const HEADERS = ['id', 'type', 'date', 'time', 'feedType', 'mlAmount', 'wipes', 'duration', 'createdAt'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Newborn Activity Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getLogs() {
  const sheet = getLogSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues()
    .filter(row => row[0])
    .map(row => ({
      id: row[0],
      type: row[1],
      date: row[2],
      time: row[3],
      feedType: row[4],
      mlAmount: Number(row[5]) || 0,
      wipes: Number(row[6]) || 0,
      duration: Number(row[7]) || 0,
      createdAt: row[8]
    }));
}

function saveLog(payload) {
  const entry = validateEntry_(payload);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getLogSheet_();
    entry.id = Utilities.getUuid();
    entry.createdAt = new Date().toISOString();
    sheet.appendRow([
      entry.id,
      entry.type,
      entry.date,
      entry.time,
      entry.feedType,
      entry.mlAmount,
      entry.wipes,
      entry.duration,
      entry.createdAt
    ]);
    return entry;
  } finally {
    lock.releaseLock();
  }
}

function deleteLog(id) {
  const recordId = String(id || '');
  if (!/^[A-Za-z0-9-]{1,100}$/.test(recordId)) return false;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getLogSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;

    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
    const offset = ids.findIndex(row => row[0] === recordId);
    if (offset < 0) return false;
    sheet.deleteRow(offset + 2);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function getLogSheet_() {
  if (SPREADSHEET_ID === 'PASTE_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID in Code.gs before using the tracker.');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange(1, 3, sheet.getMaxRows(), 2).setNumberFormat('@');
  } else {
    const actualHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
    if (HEADERS.some((header, index) => actualHeaders[index] !== header)) {
      throw new Error(`The "${SHEET_NAME}" tab has unexpected columns. Keep the header row unchanged.`);
    }
  }
  return sheet;
}

function validateEntry_(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid activity record.');

  const type = String(payload.type || '');
  const date = String(payload.date || '');
  const time = String(payload.time || '');
  if (!['feed', 'diaper', 'sleep'].includes(type)) throw new Error('Choose a valid activity type.');
  if (!isValidDate_(date)) throw new Error('Choose a valid activity date.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Choose a valid activity time.');

  const entry = {
    type: type,
    date: date,
    time: time,
    feedType: '',
    mlAmount: 0,
    wipes: 0,
    duration: 0
  };

  if (type === 'feed') {
    entry.feedType = String(payload.feedType || '');
    if (!['Formula', 'Breast Feed'].includes(entry.feedType)) throw new Error('Choose a valid feed method.');
    entry.mlAmount = validateMetric_(payload.mlAmount, 'milk volume');
  } else if (type === 'diaper') {
    entry.feedType = 'Diaper Change';
    entry.wipes = validateMetric_(payload.wipes, 'wipe count');
  } else {
    entry.feedType = 'Sleep Log';
    entry.duration = validateMetric_(payload.duration, 'sleep duration');
  }

  return entry;
}

function validateMetric_(value, label) {
  if (value === '' || value === null || typeof value === 'undefined') {
    throw new Error(`Enter a ${label}.`);
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`Enter a valid non-negative ${label}.`);
  return number;
}

function isValidDate_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parts = value.split('-').map(Number);
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return date.toISOString().slice(0, 10) === value;
}