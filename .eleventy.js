const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

  const md = new markdownIt({
    html: true,
  });
  
  eleventyConfig.addFilter("markdown", (content) => {
    return md.renderInline(content);
  });

  // Return your Object options:
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    }
  }
};