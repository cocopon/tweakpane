'use strict';

const Jsdom = require('jsdom').JSDOM;

// Require default module
const Tweakpane = require('tweakpane');

const PARAMS = {
	foo: 1,
};

// Create pane
const doc = new Jsdom('').window.document;
const pane = new Tweakpane({
	document: doc,
});

// Add input
const input = pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});
console.log(input);
