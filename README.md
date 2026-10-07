# Newborn Activity Tracker

A responsive activity tracker for recording feedings, diaper changes, and sleep. Activity records are stored in Google Sheets and loaded into the daily history and date-range summaries.

## Features

- Record activity type, local date and time, and the relevant measurement.
- View daily feeding, diaper, and sleep totals with an activity history.
- Calculate totals across a selected date range.
- Delete records from the sheet.
- Refresh records when the app loads, when its section navigation changes, and when its browser tab regains focus.

## Requirements

- A Google account and a Google spreadsheet.
- Access to Google Apps Script.

## Setup

The recommended deployment is a private Apps Script web app. It runs the UI and accesses the spreadsheet as your Google account, so use the Apps Script deployment URL and sign in with that account on each device.

1. Open or create the Google spreadsheet for the tracker.
2. Copy its spreadsheet ID from the URL (the part between `/d/` and `/edit`).
3. In the spreadsheet, select **Extensions > Apps Script**.
4. Replace the script project's `Code.gs` contents with this repository's `Code.gs`. Replace `PASTE_GOOGLE_SHEET_ID_HERE` with the spreadsheet ID.
5. Add an Apps Script HTML file named `index` and paste in this repository's `index.html` contents.
6. Save, then select **Deploy > New deployment** and choose **Web app**.
7. Set **Execute as** to **Me** and **Who has access** to **Only myself**. Deploy and authorize the requested spreadsheet access.
8. Open the deployed web app URL. The app creates a `Baby Logs` sheet tab on first use.

For more detail, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).

## Data Access

Keep the Apps Script deployment restricted to your account. Do not deploy this spreadsheet-backed app for anyone with the link: the app handles private child activity records. The GitHub Pages version is public and does not connect to the private Apps Script backend; use the Apps Script URL for the working tracker.

Records previously stored by the local-only version are not automatically imported into the spreadsheet.

## Project Files

- `index.html` - tracker interface and browser-side behavior.
- `Code.gs` - Apps Script web app and Google Sheets read/write operations.
- `GOOGLE_SHEETS_SETUP.md` - deployment instructions.
- `.github/workflows/jekyll-docker.yml` - existing Jekyll build workflow; it does not deploy the private Apps Script app.

After changing the Apps Script code, open **Deploy > Manage deployments**, edit the deployment, and deploy a new version.