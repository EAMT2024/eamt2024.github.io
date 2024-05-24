let calendar;

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'Europe/London',
    events: '/events.json',
    nowIndicator: true,
    slotEventOverlap: false,
    initialView: localStorage.fcView || 'timeGridWeek',
    initialDate: '2024-06-23',
    validRange: {
      start: '2024-06-23',
      end: '2024-06-28'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    headerToolbar: {
      'start': 'prev,next',
      // 'center': 'title',
      'end': 'timeGridWeek,timeGridToday,timeListWeek'
    },
    buttonText: {
      'timeGridToday': 'today',
      'timeGridWeek': 'days',
      'timeListWeek': 'list'
    },
    views: {
      timeGridToday: {
        type: 'timeGrid',
        duration: { days: 1 }
      },
      timeGridWeek: {
        type: 'timeGrid',
        duration: { days: 5 }
      },
      timeListWeek: {
        type: 'list',
        duration: { days: 5 }
      }
    },
    dayHeaderFormat: dateFormat,
    listDayFormat: dateFormat,
    eventTimeFormat: { // like '14:30'
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    themeSystem: 'bootstrap5',
    eventDidMount: function(info) {
      if (info.view.type.startsWith("timeGrid")) {
        let title = info.event.title;
        if (title.includes(":") && (!title.includes("-") || (title.indexOf(":") < title.indexOf("-")))) {
          let titleParts = title.split(":");
          title = "<b>" + titleParts[0] + "</b><br>" + titleParts.slice(1).join(":");
        }
        var tooltip = new bootstrap.Tooltip(info.el, {
          title: title,
          html: true,
          placement: 'top',
          trigger: 'hover',
          container: 'body'
        });
      }
    },
    eventWillUnmount: function(info) {
      if (info.view.type.startsWith("timeGrid")) {
        var tooltip = bootstrap.Tooltip.getInstance(info.el);
        if (tooltip) {
          tooltip.dispose();
        }
      }
    },
    eventClick: function(info) {
      if (info.view.type.startsWith("timeGrid")) {
        if (info.event.extendedProps.type === "session") {
          let modalId = 'session-modal-' + info.event.extendedProps.session.session_code;
          let modalEl = document.getElementById(modalId);
          let modal = bootstrap.Modal.getOrCreateInstance(modalEl)
          modal.show()
        }
      } else if (info.view.type === 'timeListCustom') {
        let collapseEl = info.el.querySelector('.accordion-collapse.collapse');
        if (collapseEl) {
          bootstrap.Collapse.getOrCreateInstance(collapseEl).toggle();
        }
      }

      if (info.event.extendedProps.type !== "session" && info.event.extendedProps.link) {
        window.open(info.event.extendedProps.link, '_blank');
      }
    },
    eventContent: function(arg) {
      if (arg.view.type === 'timeListCustom') {
        return renderTimeListEl(arg);
      }

      return true;
    },
    eventClassNames: function(arg) {
      if (arg.event.extendedProps.link) {
        return ['has-event-link'];
      }
      if (arg.event.extendedProps.type === "session") {
        return ['has-event-modal'];
      }
    },
    datesSet: function(dateInfo) {
      localStorage.fcView = dateInfo.view.type;
    },
  });
  calendar.render();

  let resetDate = () => calendar.gotoDate('2024-06-23');

  document.querySelector('.fc-timeGridWeek-button').addEventListener('click', resetDate)
  document.querySelector('.fc-timeListWeek-button').addEventListener('click', resetDate)
});

function renderTimeListEl(arg) {
  let domNodes = [];

  if (arg.event.extendedProps.type === "session" && !arg.event.extendedProps.session.is_boaster) {
    let sessionListId = 'list-view-sess-' + arg.event.extendedProps.session.session_code;
    let sessionListEl = document.getElementById(sessionListId);
    let sessionListCl = sessionListEl.content.cloneNode(true);
    sessionListCl.querySelector('.calendar-sess-title').innerHTML = arg.event.title;
    domNodes.push(sessionListCl);
  } else {
    let divEl = document.createElement('div');
    divEl.innerHTML = arg.event.title;

    domNodes.push(divEl);
  }

  return { domNodes: domNodes};
}

function dateFormat(date) {
  let dateM = FullCalendar.Moment.toMoment(date.date, calendar);
  let startDate = moment("2024-06-23")
  let dateF = dateM.format('Do MMM');
  let dayN = dateM.diff(startDate, 'days');

  return dateF + ' (Day ' + dayN + ')';
}
