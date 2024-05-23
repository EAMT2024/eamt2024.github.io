let paperData = require('./papers.json')

module.exports = function () {
    let papersGrouped = {}
    paperData.forEach(paper => {
      let track = paper.track
      let format = paper.Format.toLowerCase()
      if (!papersGrouped[track]) {
      papersGrouped[track] = {"oral": [], "poster": []}
      }

      papersGrouped[track][format].push(paper)
    })

    // Sort the papers alphabetically
    for (let track in papersGrouped) {
      for (let format in papersGrouped[track]) {
        papersGrouped[track][format].sort((a, b) => {
          return a.title.localeCompare(b.title)
        })
      }
    }

    return papersGrouped
}