document.addEventListener("DOMContentLoaded", function() {
  const sessBadgeList = document.querySelectorAll('.session-badge')
  
  sessBadgeList.forEach(sessBadgeEl => {
    let sessId = sessBadgeEl.dataset.sess;
    new bootstrap.Popover(sessBadgeEl, {
      'content': document.getElementById(`t-${sessId}-body`).innerHTML,
      'html': true,
      'trigger': 'hover click focus',
      'customClass': 'session-badge-popover',
      'title': document.getElementById(`t-${sessId}-title`).innerHTML,
      'placement': 'right'
    })
  })
})