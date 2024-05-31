const req = require('require-yml')
let paperData = req('src/_data/papers.yml');
let sessions = req('src/_data/sessions.yml');

// Helper function to check if a string contains only \textit or \textbf
function containsOnlyFormatting(content) {
  // Remove \textit and \textbf content and check if anything is left
  let cleaned = content.replace(/\\textit{([^}]*)}/g, '')
                        .replace(/\\textbf{([^}]*)}/g, '');
  // Trim and check if the cleaned string is empty
  return cleaned.trim() === '';
}

function latexToMarkdown(latex) {
  // replace `` and '' with quotes
  latex = latex.replace(/``/g, '"').replace(/''/g, '"');

  // replace -- with em dash
  latex = latex.replace(/--/g, '—');

  // replace \citep, \citet, \cite commands with (citation removed)
  latex = latex.replace(/\\cite(p|t)?{[^}]*}/g, '(citation removed)');


  // Handle math environments first
  latex = latex.replace(/\$(.*?)\$/g, (match, p1) => {
      if (containsOnlyFormatting(p1)) {
          // Replace \textit and \textbf if it contains only these
          let cleaned = p1.replace(/\\textit{([^}]*)}/g, '*$1*')
                          .replace(/\\textbf{([^}]*)}/g, '**$1**');
          return cleaned;
      }
      // Keep the dollar signs for actual math content
      return `$${p1}$`;
  });

  // Convert \textit to * for italics outside math environments
  latex = latex.replace(/\\textit{([^}]*)}/g, '*$1*');
  
  // Convert \textbf to ** for bold outside math environments
  latex = latex.replace(/\\textbf{([^}]*)}/g, '**$1**');

  return latex;
}

module.exports = function () {
    let papersByTrack = {}
    let papersBySession = {}
    let papersByCoarseSession = {}
    paperData.forEach(paper => {
      let track = paper.track
      if (!papersByTrack[track]) {
        papersByTrack[track] = []
      }
      let session = paper.session
      if (!papersBySession[session]) {
        papersBySession[session] = []
      }

      paper.title = latexToMarkdown(paper.title)
      paper.abstract = latexToMarkdown(paper.abstract)

      if (!paper.session) {
        console.log("No session for paper: " + paper.title)
        paper.session_path = [null, null]
      } else {    
        paper.session_path = paper.session.split("_")
        paper.coarse_session = paper.session.slice(0, -1)
        if (paper.session_path.length !== 2) {
          console.log("Invalid session for paper: " + paper.title)
          paper.session_path = [null, null]
        }
      }

      if (!papersByCoarseSession[paper.coarse_session]) {
        papersByCoarseSession[paper.coarse_session] = []
      }

      // paper.session_data = sessions[paper.session_path[0]][paper.session_path[1]]


      papersByTrack[track].push(paper)
      papersBySession[session].push(paper)
      papersByCoarseSession[paper.coarse_session].push(paper)
    })

    // Sort the papers alphabetically
    for (let track in papersByTrack) {
      papersByTrack[track].sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    }

    for (let session in papersBySession) {
      papersBySession[session].sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    }

    for (let session in papersByCoarseSession) {
      papersByCoarseSession[session].sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    }

    return {
      byTrack: papersByTrack,
      bySession: papersBySession,
      byCoarseSession: papersByCoarseSession,
    }
}