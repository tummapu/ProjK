# Newborn Activity Tracker

A responsive browser-only activity tracker for recording feedings, diaper changes, and sleep. Activities appear in the daily history and date-range summaries and are saved in the browser's local storage.

## Features

- Record activity type, local date and time, and the relevant measurement.
- View daily feeding, diaper, and sleep totals with an activity history.
- Calculate totals across a selected date range.
- Delete records from the browser.
- Keep records when reopening the app in the same browser profile.

## Use

Open `index.html` in a browser and save activities using the form. Records are stored only in that browser on that device; they are not shared across browsers or devices. Clearing the browser's stored site data removes them.

## Project Files

- `index.html` - tracker interface and browser-side storage.
- `.github/workflows/jekyll-docker.yml` - existing Jekyll build workflow.
