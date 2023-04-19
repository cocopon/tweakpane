/* eslint-disable no-console */
/* eslint-env node */

import Fs from 'fs';
import {JSDOM as Jsdom} from 'jsdom';
// Require default module
import {Pane, VERSION} from 'tweakpane';

const Package = JSON.parse(
	Fs.readFileSync(new URL('../../package.json', import.meta.url)),
);

// Check version
if (VERSION.toString() !== Package.version) {
	throw new Error('invalid version');
}

const PARAMS = {
	foo: 1,
};

// Create pane
const doc = new Jsdom('').window.document;
const pane = new Pane({
	document: doc,
});

// Add input
const input = pane.addBinding(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});
console.log(input);
