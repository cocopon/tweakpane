'use strict';

const Jsdom = require('jsdom').JSDOM;
const Tweakpane = require('tweakpane');

const PARAMS = {
	foo: 1,
};
const pane = new Tweakpane({
	document: (new Jsdom('')).window.document,
});
pane.addInput(PARAMS, 'foo');
console.log(pane);
