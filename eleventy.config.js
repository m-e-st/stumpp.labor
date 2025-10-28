/** v2.3 - 2025-03-04 **/
/** v2.4 - 2025-04-07 replace eleventy-img by markdown-it-obsidian-images **/
/** v2.5 - 2025-05-11 encryption by sjcl **/
/** v2.6 - 2025-05-29 js-yaml **/
/** v2.7 - 2025-10-28 dotenvx **/

const htmlMinifier = require ('html-minifier-terser');
const lucideIcons = require("@grimlink/eleventy-plugin-lucide-icons");
const markdownItCallouts = require("markdown-it-obsidian-callouts");					/* v2.1 */
const markdownObsidianImages = require('markdown-it-obsidian-images');					/* v2.4 */
const markdownWikilinks = require('markdown-it-obsidian');								/* v2.6 */
const path = require('path');															/* v2.2 */
const sjcl = require("sjcl");
const yaml = require("js-yaml");														/* v2.6 */
require('dotenv').config(); // load .env into process.env								/* v2.7 */

module.exports = function (eleventyConfig) {
	eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItCallouts));		/* v2.1 */
	eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownObsidianImages({ makeAllLinksAbsolute: true, baseURL: '/blog/img/' })));	/* v2.4 */
	eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownWikilinks()));			/* v2.6 */
	
    eleventyConfig.addPlugin(lucideIcons);
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    
  	eleventyConfig.addShortcode("anchor", function setAnchor(anchorName) { return `<a name="${anchorName}"><br><br><hr></a>`; });
  	eleventyConfig.addPairedShortcode("crypt", function(content, password = "", classList="") { 		/* v2.5 */
		return `<ms-crypted style='display:none' class='${classList}' `
			 + "data-content='" + sjcl.encrypt(password, content) + "'>"
			 + "Content is encrypted.<br>Inhalt ist verschlüsselt.<br>El contenido está encriptado."
			 + "</ms-crypted>";
	});  	
  	eleventyConfig.addFilter("Datum", function(value, lang="de") {
		const string = value.toISOString();
		if(lang=="en") return string.slice(5,7) +'/' + string.slice(8,10) + '/' + string.slice(0,4);
		if(lang=="ja") return string.slice(0,4) +'-' + string.slice(5,7) + '-' + string.slice(8,10);
		return string.slice(8,10) +'.' + string.slice(5,7) + '.' + string.slice(0,4);
	});
  	eleventyConfig.addFilter("dateTitle", function(value) {
		const token = value.split('_')[1];
		
		if (! token) return "ERROR 1";
		const parts = token.split('-');
		return parts[2] + '-' + parts[1] + '-' + parts[0];
	});
  	eleventyConfig.addFilter("Ascii", function(value) {
		const originalChars = "äöüÄÖÜßÑñáéíóú";
		const replacementChars = "aouAOUSNnaeiou";
		let result = value;
		for (let i = 0; i < originalChars.length;i++)
			result = result.replaceAll(originalChars[i], replacementChars[i]);
		return result;
	});
  	eleventyConfig.addFilter("Basename", function(value) {							/* v2.2 */
		let result = path.basename(value, ".html");
		return result;
	});
  	eleventyConfig.addFilter("Paragraphs", function(value) {							/* v2.2 */
		let result = "<p>" + value.replaceAll("\n", "</p>\n<p>") + "</p>"
		return result;
	});
  	/* Custom "upperWords" deleted - use "title" instead */

	eleventyConfig.addTransform ('htmlMinifier', function(content,outputPath) {
		if (	(process.env.ELEVENTY_ENV === 'production')
			&&	(outputPath)
			&&	( (outputPath.indexOf('.html') > -1) ||  (outputPath.indexOf('.css') > -1) )
		   ) {
			return htmlMinifier.minify (content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
				minifyJS: true,
				minifyCSS: true,
			});
		}
		return content;
	});

	// Folders to copy to build dir (See. 1.1)
	eleventyConfig.addPassthroughCopy("src/static/**");
	eleventyConfig.addPassthroughCopy("src/favicon.ico");
	eleventyConfig.addPassthroughCopy("src/**/*.php");
	
	eleventyConfig.addPassthroughCopy("src/blog/**/*.png");
	eleventyConfig.addPassthroughCopy("src/blog/**/*.jpg");
	eleventyConfig.addPassthroughCopy("src/blog/**/*.jpeg");
	eleventyConfig.addPassthroughCopy("src/blog/**/*.svg");

	// This allows Eleventy to watch for file changes during local development.
	//~ eleventyConfig.addWatchTarget("src/**/*.php");
	eleventyConfig.addWatchTarget("src/_library/");
	eleventyConfig.setUseGitIgnore(false);

	return {
		dir: {
			input: "src/",
			output: "docs/",
			includes: "_includes",
			layouts: "_layouts"
		},
		templateFormats: ["html", "md", "njk"],
		htmlTemplateEngine: "njk",
		passthroughFileCopy: true	// 1.1 Enable eleventy to pass dirs specified above
	};
};

