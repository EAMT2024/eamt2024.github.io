const req = require('require-yml')
let calendarData = req('src/_data/calendar.yml');
let calendarDefaults = req('src/_data/calendarDefaults.yml');
let sessions = req('src/_data/sessions.yml');
let tracks = req("src/_data/tracks.yml")
let groupedPapers = require("./groupedPapers.js")();
let papersBySession = groupedPapers.bySession;
var clone = require('clone');
let config = req('src/_data/config.yml');

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


module.exports = function () {
  return calendarData.map(e => {
    let event = clone(e);
    // Look up event.type in calendarDefaults and merge
    let defaults = calendarDefaults.default
    if (event.type === "session") {
      let typeDefaults = calendarDefaults.type[event.type][event.session.type] || {}
      defaults = {...defaults, ...typeDefaults}

      if (event.session.is_boaster) {
        let boasterDefaults = calendarDefaults.type.session.poster_boaster || {}
        defaults = {...defaults, ...boasterDefaults }
      }
    } else {
      let typeDefaults = calendarDefaults.type[event.type] || {}
      defaults = {...defaults, ...typeDefaults}
    }

    let titleDefaults = calendarDefaults.title[event.title] || {}
    defaults = {...defaults, ...titleDefaults}

    if (event.type === "session") {
      let session = sessions[event.session.type][event.session.idx]
      let track = tracks[session.track]
      let session_code = `${event.session.type}_${event.session.idx}`
      event.session = {...event.session, ...session, track: track, session_code: session_code}

      event.title = `${session.title} - ${track}`
    }

    if (event.type == "session" && event.session.type == "poster" && event.session.is_boaster) {
      event.title = event.title.replace("Poster Session", "Poster Boaster")
    }

    event = {...defaults, ...event}

    if (event.prefixType) {
      event.title = `${capitalize(event.type)}: ${event.title}`
    }

    if (!config.show_locations) {
      delete event.location
    }

    return event
  })
}