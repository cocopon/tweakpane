/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */

'use strict';

const Fs = require('fs-extra');
const corePackage = require('../../core/package');
const panePackage = require('../package');

// Remove version of core tgz file
process.chdir('../core');

const coreTgz = `tweakpane-core-${corePackage.version}.tgz`;
if (Fs.existsSync(coreTgz)) {
	Fs.renameSync(coreTgz, 'tweakpane-core.tgz');
}

// Remove version of tweakpane tgz file
process.chdir('../tweakpane');

const paneTgz = `tweakpane-${panePackage.version}.tgz`;
if (Fs.existsSync(paneTgz)) {
	Fs.renameSync(paneTgz, 'tweakpane.tgz');
}
