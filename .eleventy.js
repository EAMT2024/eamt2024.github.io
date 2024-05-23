module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

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