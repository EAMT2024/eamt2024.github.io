const {DateTime} = require('luxon')
const req = require('require-yml')
let calendarData = req('src/_data/calendar.yml');

module.exports = function () {
  let eventsByDate = {}
  calendarData.forEach(event => {
    let date = DateTime.fromISO(event.date)
    if (!eventsByDate[date]) {
      eventsByDate[date] = []
    }
    eventsByDate[date].push(event)
  })
  return eventsByDate
}