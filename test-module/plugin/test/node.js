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
const elem = input.controller.view.element.querySelector('.tp-tstv');
if (!elem) {
	assert.fail('custom view not found');
}

if (elem.textContent !== params.foo) {
	assert.fail('invalid display value');
}
