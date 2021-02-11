'use strict';

const Jsdom = require('jsdom').JSDOM;

// Require the default module
const Tweakpane = require('tweakpane');

const PARAMS = {
	foo: 1,
};

// Creating a pane
const pane = new Tweakpane({
	document: (new Jsdom('')).window.document,
});

// Add an input
pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});

console.log(pane);
