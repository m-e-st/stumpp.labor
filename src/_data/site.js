module.exports = {
	title: "stumpp labor",
	description: "Labor für Stumpp Framework",
	caption: "Labor",
	version : "0.1.0",
	mail: "michael@stumpp.name",

	scriptdir: "./static",
	imagedir: "./static/img",
	pagelogo: "./static/pagelogo.svg",

	author: {
		name: "Michael Stumpp",
		year: 2025,
		hide: false,
		mail: "michael@stumpp.name",
		code: "&#x6d;&#x69;&#x63;&#x68;&#x61;&#x65;&#x6c;&#x40;&#x73;&#x74;&#x75;&#x6d;&#x70;&#x70;&#x2e;&#x6e;&#x61;&#x6d;&#x65;"
	}, 

	ssg: {
		name:			"Eleventy",
		version:		process.env.ELEVENTY_VERSION,
		root:			process.env.ELEVENTY_ROOT,
		environment:	process.env.ELEVENTY_ENV
	},
	dev:  process.env.ELEVENTY_ENV === 'development',
	env:  process.env.ELEVENTY_ENV === 'production',
	host:  process.env.ENVIRONMENT || 'unknown',
	built: new Date().toISOString()
}

