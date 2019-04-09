const htmlmin = require("html-minifier");
const EleventyEnv = require("./src/_data/helpers.js");
const componentsDir = "src/_includes/components";

// Components
const ClientList = require(`./${componentsDir}/Clients.js`);

module.exports = function (eleventyConfig) {
  // Shortcodes
  eleventyConfig.addShortcode('ClientList', ClientList);

  if (EleventyEnv.environment !== "development") {
    // Minify HTML output
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
      if (outputPath.indexOf(".html") > -1) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }
      return content;
    });
  }

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("src/static");



  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    }
  }
}