import { Popover } from "bootstrap";

document.addEventListener("DOMContentLoaded", function() {
  const sessBadgeList = document.querySelectorAll('.session-badge')
  
  sessBadgeList.forEach(sessBadgeEl => {
    let paperIdx = sessBadgeEl.dataset.paperIdx;
    if (!paperIdx) {
      return;
    }
    new Popover(sessBadgeEl, {
      'content': document.getElementById(`t-${paperIdx}-body`).innerHTML,
      'html': true,
      'trigger': 'hover click focus',
      'customClass': 'session-badge-popover',
      'title': document.getElementById(`t-${paperIdx}-title`).innerHTML,
      'placement': 'right'
    })
  })
})