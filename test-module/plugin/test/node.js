const Jsdom = require('jsdom').JSDOM;
const Tweakpane = require('tweakpane');
require('../dist/bundle');

const doc = new Jsdom('').window.document;
const params = {foo: 'hello, world'};
const pane = new Tweakpane({
	document: doc,
});

const input = pane.addInput(params, 'foo', {
	view: 'test',
});
const iv = input.controller.controller.view;

const valueElem = iv.element.querySelector('button');
if (!valueElem) {
	throw new Error('custom view not found');
}

if (valueElem.textContent !== params.foo) {
	throw new Error('invalid display value');
}
