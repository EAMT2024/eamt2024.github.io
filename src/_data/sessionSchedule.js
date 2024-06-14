const req = require('require-yml')
const calendarData = require('./calendarMerged.js')();

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

  // console.log(newSessions);

  return newSessions;
}