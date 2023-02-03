/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */

'use strict';

const Fs = require('fs-extra');
const Glob = require('glob');
const Path = require('path');
const Package = require('../package');

const PATTERN = 'dist/*';

const paths = Glob.sync(PATTERN);
paths.forEach((path) => {
	const fileName = Path.basename(path);
	if (Fs.statSync(path).isDirectory()) {
		return;
	}

	const ext = fileName.match(/(\..+)$/)[1];
	const base = Path.basename(fileName, ext);
	const versionedPath = Path.join(
		Path.dirname(path),
		`${base}-${Package.version}${ext}`,
	);
	Fs.rename(path, versionedPath);
});
