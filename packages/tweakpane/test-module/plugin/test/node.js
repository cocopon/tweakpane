/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */
const Jsdom = require('jsdom').JSDOM;
const {Pane} = require('tweakpane');
const TestInputPlugin = require('../dist/bundle');

const doc = new Jsdom('').window.document;
const params = {foo: 'hello, world'};
const pane = new Pane({
	document: doc,
});
pane.registerPlugin(TestInputPlugin);

const input = pane.addBinding(params, 'foo', {
	view: 'test',
});
const elem = input['controller_'].view.element.querySelector('.tp-tstv');
if (!elem) {
	throw new Error('custom view not found');
}

if (elem.textContent !== params.foo) {
	throw new Error('invalid display value');
}
