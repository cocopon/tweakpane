/* eslint-disable no-console */
/* eslint-env node */

import Fs from 'fs-extra';
import Glob from 'glob';
import Nunjucks from 'nunjucks';
import Path from 'path';

const Package = JSON.parse(
	Fs.readFileSync(new URL('../package.json', import.meta.url)),
);

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
