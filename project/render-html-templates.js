/* eslint-disable no-console */

'use strict';

const Fs = require('fs-extra');
const Glob = require('glob');
const Nunjucks = require('nunjucks');
const Path = require('path');
const Package = require('../package');

const context = {
	version: Package.version,
};

const SRC_DIR = 'src/doc/template';
const SRC_PATTERN = 'src/doc/template/*.html';
const DST_DIR = 'docs';

Fs.mkdirsSync(DST_DIR);

const srcPaths = Glob.sync(SRC_PATTERN).filter((path) => {
	return Path.basename(path).match(/^_.+$/) === null;
});
console.log(`Found sources: ${srcPaths.join(', ')}`);

const env = new Nunjucks.Environment(
	new Nunjucks.FileSystemLoader(SRC_DIR),
);

srcPaths.forEach((srcPath) => {
	const srcBase = Path.basename(srcPath);
	const dstPath = Path.join(DST_DIR, srcBase);
	Fs.writeFileSync(
		dstPath,
		env.render(srcBase, context),
	);
});

console.log('done.');
