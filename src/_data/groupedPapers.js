let paperData = require('./papers.json')

function latexToMarkdown(latex) {
  // Helper function to check if a string contains only \textit or \textbf
  function containsOnlyFormatting(content) {
      // Remove \textit and \textbf content and check if anything is left
      let cleaned = content.replace(/\\textit{([^}]*)}/g, '')
                           .replace(/\\textbf{([^}]*)}/g, '');
      // Trim and check if the cleaned string is empty
      return cleaned.trim() === '';
  }

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
    let papersGrouped = {}
    paperData.forEach(paper => {
      let track = paper.track
      let format = paper.Format.toLowerCase()
      if (!papersGrouped[track]) {
      papersGrouped[track] = {"oral": [], "poster": []}
      }

      paper.abstract = latexToMarkdown(paper.abstract)

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