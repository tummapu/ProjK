# Private Google Sheets setup

The tracker uses Apps Script for both the UI and its Sheets access. Keep the web app restricted to your Google account; the GitHub Pages copy cannot connect to this private backend.

1. Open or create the Google spreadsheet that will hold the records. Copy the spreadsheet ID from its URL: the text between `/d/` and `/edit`.
2. In the spreadsheet, choose **Extensions > Apps Script**.
3. Replace the contents of `Code.gs` with the repository's `Code.gs`, and replace `PASTE_GOOGLE_SHEET_ID_HERE` with the copied ID.
4. In Apps Script, add an HTML file named `index` and paste in the repository's `index.html` contents.
5. Save the project, then choose **Deploy > New deployment**. Select **Web app**, set **Execute as** to **Me**, and set **Who has access** to **Only myself**. Deploy and approve the requested permissions.
6. Open the web app URL shown by the deployment. The app creates a `Baby Logs` tab the first time it loads.

Use that Apps Script web app URL on your devices while signed in to the same Google account. The GitHub Pages URL is public and does not connect to this private Sheets-backed version. After changing the Apps Script code, use **Deploy > Manage deployments**, edit the deployment, and deploy a new version.