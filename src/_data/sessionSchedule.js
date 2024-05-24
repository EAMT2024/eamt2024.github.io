const req = require('require-yml')
let sessionData = req('src/_data/sessions.yml');
let calendarData = req('src/_data/calendar.yml');

module.exports = function() {
  let newSessions = {};

  for (e of calendarData) {
    if (e.type !== 'session') {
      continue;
    }

    let idx = e.session.idx
    let type = e.session.type;

    let sess_str = type + '_' + idx;

    if (!newSessions[sess_str]) {
      newSessions[sess_str] = [];
    }

    newSessions[sess_str].push(e);
  }

  return newSessions;
}