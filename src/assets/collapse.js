import { Collapse } from "bootstrap"

function toggleCollapseAll(element, new_val) {
  element.dataset.action = new_val

  let icon = element.getElementsByTagName('i')[0]

  if (element.dataset.action == 'show') {
    icon.classList.remove('fa-minus')
    icon.classList.add('fa-plus')
  } else {
    icon.classList.remove('fa-plus')
    icon.classList.add('fa-minus')
  }

  let text = element.getElementsByTagName('span')[0]
  if (element.dataset.action == 'hide') {
    text.innerText = text.innerText.replace('Show', 'Hide')
  } else {
    text.innerText = text.innerText.replace('Hide', 'Show')
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const collapseElementList = document.querySelectorAll('.toggling-collapse')

  collapseElementList.forEach((element) => {
    element.addEventListener('show.bs.collapse', function (event) {
      let collapser = Collapse.getInstance(event.target)
      collapser._triggerArray.forEach((element) => {
        let icon = element.getElementsByTagName('i')[0]
        icon.classList.remove('fa-plus')
        icon.classList.add('fa-minus')
      })
    })
    element.addEventListener('hide.bs.collapse', function (event) {
      let collapser = Collapse.getInstance(event.target)
      collapser._triggerArray.forEach((element) => {
        let icon = element.getElementsByTagName('i')[0]
        icon.classList.remove('fa-minus')
        icon.classList.add('fa-plus')
      })
    })
  })

  document.querySelectorAll('.collapse-all').forEach((triggerEl) => {
    let target = triggerEl.dataset.target
    let collapseEls = document.querySelectorAll(target)

    triggerEl.addEventListener('click', function(event) {
      collapseEls.forEach((element) => {
        let collapser = Collapse.getOrCreateInstance(element)
        if (triggerEl.dataset.action == 'show') {
          collapser.show()
        } else {
          collapser.hide()
        }
      })

      let new_val = triggerEl.dataset.action == 'show' ? 'hide' : 'show'

      toggleCollapseAll(triggerEl, new_val)
    })
  })
});


