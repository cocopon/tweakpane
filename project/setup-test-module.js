/* eslint-disable no-console */

'use strict';

const Fs = require('fs-extra');
const Package = require('../package');

const json = Fs.readFileSync('test-module/package.json.template', 'utf8');
Fs.writeFileSync(
	'test-module/package.json',
	json.replace('${version}', Package.version),
);
