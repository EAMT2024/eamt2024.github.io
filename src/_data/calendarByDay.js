let calendarData = require('./calendarMerged.js')();

module.exports = function () {
  let eventsByDate = {}
  calendarData.forEach(event => {
    let date = event.date;
    if (!eventsByDate[date]) {
      eventsByDate[date] = []
    }
    eventsByDate[date].push(event)
  })
  return eventsByDate
}