/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */

'use strict';

const Jsdom = require('jsdom').JSDOM;
// Require default module
const {Pane, VERSION} = require('tweakpane');

const Package = require('../../package.json');

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
