const req = require('require-yml')
let paperData = req('src/_data/papers.yml');
let tracks = req('src/_data/tracks.yml')
const {stringify} = require('csv-stringify/sync');


module.exports = function () {
  let papers = []

  for (let paper of paperData) {
    let orderNo;
    if (paper.format == 'oral') {
      orderNo = paper.session.charCodeAt(paper.session.length-1) - 96
    } else {
      orderNo = paper.poster_no
    }
    let sessionName;
    if (paper.format == 'virtual') {
      sessionName = 'virtual';
    } else {
      sessionName = paper.session.slice(0, -1)
    }

    papers.push([
      paper.title,
      paper.authors,
      tracks[paper.track],
      paper.or_num,
      paper.format,
      sessionName,
      orderNo
    ])
  }

  return stringify(papers, {
    header: true,
    columns: ['Title', 'Authors', 'Track', 'OR ID', 'Format', 'Session', 'Order No.'],
  })
}
