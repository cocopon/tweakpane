/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */

'use strict';

const Fs = require('fs-extra');
const Glob = require('glob');
const Nunjucks = require('nunjucks');
const Path = require('path');
const Package = require('../package');

const context = {
	description: Package.description,
	version: Package.version,
};

const SRC_DIR = 'src/doc/template';
const SRC_PATTERN = 'src/doc/template/**/*.html';
const DST_DIR = 'docs';

Fs.mkdirsSync(DST_DIR);

const srcPaths = Glob.sync(SRC_PATTERN).filter((path) => {
	return Path.basename(path).match(/^_.+$/) === null;
});
console.log('Found sources:');
console.log(srcPaths.map((path) => `  ${path}`).join('\n'));

const env = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(SRC_DIR));
console.log('Compiling...');
srcPaths.forEach((srcPath) => {
	const srcBase = Path.relative(SRC_DIR, srcPath);
	const dstPath = Path.join(DST_DIR, srcBase);

	const dstDir = Path.dirname(dstPath);
	if (!Fs.existsSync(dstDir)) {
		Fs.mkdirsSync(dstDir);
	}

	console.log(`  ${dstPath}`);
	Fs.writeFileSync(dstPath, env.render(srcBase, context));
});

console.log('done.');
