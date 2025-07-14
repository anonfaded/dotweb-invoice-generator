// .eleventy.js
module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets (images, fonts, etc.)
  eleventyConfig.addPassthroughCopy("src/public");

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts", 
      data: "_data"
    }
  };
};