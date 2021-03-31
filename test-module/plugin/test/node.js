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
const elem = input.controller_.view.element.querySelector('.tp-tstv');
if (!elem) {
	throw new Error('custom view not found');
}

if (elem.textContent !== params.foo) {
	throw new Error('invalid display value');
}
