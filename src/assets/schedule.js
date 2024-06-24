import { Calendar } from '@fullcalendar/core'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { toMoment } from '@fullcalendar/moment';
import { Collapse, Modal, Popover} from 'bootstrap';

import { renderEl as mathRenderEl } from './math';


function makeLocationEl(location, icon = true, tint = true) {
  let locationEl = document.createElement('div')
  locationEl.classList.add('sess-location')

  if (tint) {
    locationEl.classList.add('text-muted')
  }

  if (icon) {
    let iconEl = document.createElement('i')
    iconEl.classList.add('fa-solid',  'fa-fw','fa-location-dot', 'me-2', 'sess-details-icon')
    locationEl.appendChild(iconEl)
  }

  locationEl.appendChild(document.createTextNode(location));
  return locationEl;
}

function makeChairEl(chair, icon=true, tint=true) {
  let chairEl = document.createElement('div')
  chairEl.classList.add('sess-chair')

  if (tint) {
    chairEl.classList.add('text-muted')
  }

  if (icon) {
    let iconEl = document.createElement('i')
    iconEl.classList.add('fa-solid', 'fa-fw', 'fa-user', 'me-2', 'sess-details-icon')
    chairEl.appendChild(iconEl)
  }

  chairEl.appendChild(document.createTextNode("Chair: " + chair));
  return chairEl;

}

let calendar;

var calendarEl = document.getElementById('calendar');
calendar = new Calendar(calendarEl, {
  timeZone: 'Europe/London',
  events: '/events.json',
  plugins: [bootstrap5Plugin, momentTimezonePlugin, timeGridPlugin, listPlugin, interactionPlugin],
  themeSystem: 'bootstrap5',
  nowIndicator: true,
  slotEventOverlap: false,
  initialView: localStorage.fcView || 'timeListWeek',
  contentHeight: 'auto',
  stickyHeaderDates: true,
  initialDate: '2024-06-23',
  // now: nowTime,
  validRange: {
    start: '2024-06-23',
    end: '2024-06-28'
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  headerToolbar: {
    'start': '',
    'center': 'timeListWeek,timeGridWeek',
    'end': ''
  },
  buttonText: {
    'timeGridToday': 'today',
    'timeGridWeek': 'Calendar',
    'timeListWeek': 'List'
  },
  views: {
    timeGridToday: {
      type: 'timeGrid',
      duration: { days: 1 }
    },
    timeGridWeek: {
      type: 'timeGrid',
      duration: { days: 5 },
      allDaySlot: false
    },
    timeListWeek: {
      type: 'list',
      duration: { days: 5 }
    }
  },
  eventOrder: "start,-duration,allDay,order",
  dayHeaderFormat: dateFormat,
  listDayFormat: dateFormat,
  eventTimeFormat: { // like '14:30'
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  eventDidMount: function (info) {
    if (info.view.type.startsWith("timeGrid")) {
      let title = info.event.title;
      if (title.includes(":") && (!title.includes("-") || (title.indexOf(":") < title.indexOf("-")))) {
        let titleParts = title.split(":");
        title = titleParts[0] + "<br>" + titleParts.slice(1).join(":");
      }
      var popover = new Popover(info.el, {
        title: title,
        html: true,
        placement: 'top',
        trigger: 'hover',
        customClass: 'popover-low-pad'
      })
      let hasPopoverContent = false;
      let content = document.createElement('div');
      if (info.event.extendedProps.location) {
        content.appendChild(makeLocationEl(info.event.extendedProps.location, true, false));
        hasPopoverContent = true;
      }
      if (info.event.extendedProps.chair) {
        content.appendChild(makeChairEl(info.event.extendedProps.chair, true, false));
        hasPopoverContent = true;
      }
      if (hasPopoverContent) {
        popover.setContent({
          '.popover-header': title,
          '.popover-body': content
        });
      }
    }
  },
  eventWillUnmount: function (info) {
    if (info.view.type.startsWith("timeGrid")) {
      var popover = Popover.getInstance(info.el);
      if (popover) {
        popover.dispose();
      }
    }
  },
  eventClick: function (info) {
    if (info.view.type.startsWith("timeGrid")) {
      if (info.event.extendedProps.type === "session") {
        let modalId = 'session-modal-' + info.event.extendedProps.session.session_code;
        let modalEl = document.getElementById(modalId);
        let modal = Modal.getOrCreateInstance(modalEl)
        modal.show()

        let popover = Popover.getInstance(info.el);
        if (popover) {
          popover.hide();
        }
      }
    } else if (info.view.type === 'timeListWeek') {
      if (info.jsEvent.target.closest('.accordion')) {
        info.jsEvent.stopPropagation();
        return;
      }
      let collapseEl = info.el.querySelector('.accordion-collapse.collapse');
      if (collapseEl) {
        Collapse.getOrCreateInstance(collapseEl).toggle();
      }
    }

    if (info.event.extendedProps.type !== "session" && info.event.extendedProps.link) {
      window.open(info.event.extendedProps.link, '_blank');
    }
  },
  eventContent: function (arg) {
    if (arg.view.type === 'timeListWeek') {
      return renderTimeListEl(arg);
    }

    return true;
  },
  eventClassNames: function (arg) {
    if (arg.event.extendedProps.link) {
      return ['has-event-link'];
    }
    if (arg.event.extendedProps.type === "session") {
      return ['has-event-modal'];
    }
  },
  datesSet: function (dateInfo) {
    localStorage.fcView = dateInfo.view.type;
  },
});
calendar.render();

// document.querySelector('.fc-timeGridWeek-button').addEventListener('click', resetDate)
// document.querySelector('.fc-timeListWeek-button').addEventListener('click', resetDate)

const titleWrapperClasses = ['sess-title-wrap'];

function renderTimeListEl(arg) {
  let domNodes = [];
  if (arg.event.extendedProps.type === "session" && !arg.event.extendedProps.session.is_boaster) {
    let sessionListId = 'list-view-sess-' + arg.event.extendedProps.session.session_code;
    let sessionListEl = document.getElementById(sessionListId);
    let sessionListCl = sessionListEl.content.cloneNode(true);
    let sessionTitleParent = sessionListCl.querySelector('.calendar-sess-title');

    let sessionTitleWrapper = document.createElement('div');
    sessionTitleWrapper.classList.add(...titleWrapperClasses);

    let sessionTitleEl = document.createElement('div');
    sessionTitleEl.innerText = arg.event.title;
    sessionTitleWrapper.appendChild(sessionTitleEl);
    sessionTitleParent.appendChild(sessionTitleWrapper);
  
    let details = []
    if (arg.event.extendedProps.location) {
      let locationEl = makeLocationEl(arg.event.extendedProps.location);
      details.push(locationEl)
    }

    if (arg.event.extendedProps.chair) {
      let chairEl = makeChairEl(arg.event.extendedProps.chair);
      details.push(chairEl)
    }

    if (details.length > 0) {
      let detailsEl = document.createElement('div');
      detailsEl.classList.add('sess-details');
      details.forEach(detail => detailsEl.appendChild(detail));
      sessionTitleWrapper.appendChild(detailsEl);
    }

    mathRenderEl(sessionListCl);
    domNodes.push(sessionListCl);
  } else {
    let parentEl = document.createElement('div');
    parentEl.classList.add(...titleWrapperClasses)

    if (arg.event.extendedProps.link) {
      let linkEl = document.createElement('a');
      linkEl.href = arg.event.extendedProps.link;
      linkEl.target = '_blank';
      linkEl.innerText = arg.event.title;
      linkEl.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      parentEl.appendChild(linkEl);
    } else {
      parentEl.appendChild(document.createTextNode(arg.event.title));
    }

    let details = []
    if (arg.event.extendedProps.location) {
      let locationEl = makeLocationEl(arg.event.extendedProps.location);
      details.push(locationEl)
      parentEl.appendChild(locationEl)
    }

    if (arg.event.extendedProps.chair) {
      let chairEl = makeChairEl(arg.event.extendedProps.chair);
      details.push(chairEl)
    }

    if (details.length > 0) {
      let detailsEl = document.createElement('div');
      detailsEl.classList.add('sess-details');
      details.forEach(detail => detailsEl.appendChild(detail));
      parentEl.appendChild(detailsEl);
    }

    domNodes.push(parentEl);
  }

  return { domNodes: domNodes };
}

function dateFormat(date) {
  let dateM = toMoment(date.date, calendar);
  let startDate = moment("2024-06-23")
  let dateF = dateM.format('ddd Do');
  let dayN = dateM.diff(startDate, 'days');

  return dateF + ' (Day ' + dayN + ')';
}
