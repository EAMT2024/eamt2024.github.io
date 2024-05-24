const markdownIt = require("markdown-it");
const yaml = require("js-yaml");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

  const md = new markdownIt({
    html: true,
  });
  
  eleventyConfig.addFilter("markdown", (content) => {
    return md.renderInline(content);
  });

  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("ccc d");
  });

  eleventyConfig.addFilter("jsonDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toISODate();
  });

  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: false
  })

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