document.addEventListener("DOMContentLoaded", function() {
  console.log()
  const collapseElementList = document.querySelectorAll('.toggling-collapse')

  collapseElementList.forEach((element) => {
    element.addEventListener('show.bs.collapse', function (event) {
      let collapser = bootstrap.Collapse.getInstance(event.target)
      collapser._triggerArray.forEach((element) => {
        let icon = element.getElementsByTagName('i')[0]
        icon.classList.remove('fa-plus')
        icon.classList.add('fa-minus')
      })
    })
    element.addEventListener('hide.bs.collapse', function (event) {
      let collapser = bootstrap.Collapse.getInstance(event.target)
      collapser._triggerArray.forEach((element) => {
        let icon = element.getElementsByTagName('i')[0]
        icon.classList.remove('fa-minus')
        icon.classList.add('fa-plus')
      })
    })
  })
});


