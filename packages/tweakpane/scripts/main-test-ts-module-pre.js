/* eslint-disable no-console */
/* eslint-env node */

import Fs from 'fs';

const corePackage = JSON.parse(
	Fs.readFileSync(new URL('../../core/package.json', import.meta.url)),
);
const panePackage = JSON.parse(
	Fs.readFileSync(new URL('../package.json', import.meta.url)),
);

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
