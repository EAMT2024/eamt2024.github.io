# Conference Data

In this directory are YML files which contain human-written data about the conference, and JS files which transform it into usable data.

## YML Files
* `calendar.yml` - The conference schedule
* `calendarDefaults.yml` - Default values for types of events
* `papers.yml` - The list of papers
* `sessions.yml` - List of oral/poster sessions. Referenced by `calendar.yml` and `papers.yml`
* `tracks.yml` - List of tracks. Referenced by `papers.yml`

## Computed JS Files
* `calendarByDay.js` - Groups calendar by day (unused currently)
* `calendarMerged.js` - Formats and merges in defaults for the calendar
* `groupedPapers.js` - Generates papers grouped by track and session
* `sessionSchedule.js` - Generates list of events asigneed to each session, used to handle poster sessions having the actual event and boaster.