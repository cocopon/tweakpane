/* eslint-disable no-console */
/* eslint-env node */
import {JSDOM as Jsdom} from 'jsdom';
import {Pane} from 'tweakpane';

import * as TestPlugin from '../dist/bundle.js';

const doc = new Jsdom('').window.document;
const params = {foo: 'hello, world'};
const pane = new Pane({
	document: doc,
});
pane.registerPlugin(TestPlugin);

// Create binding
((b) => {
	const elem = b.element.querySelector('.tp-tstv');
	if (!elem) {
		throw new Error('custom view not found');
	}

	if (elem.textContent !== params.foo) {
		throw new Error('invalid display value');
	}
})(
	pane.addBinding(params, 'foo', {
		view: 'test',
	}),
);

// Create blade
((b) => {
	if (!b.element.classList.contains('tp-tstv')) {
		throw new Error('custom view not found');
	}
})(
	pane.addBlade({
		value: 'foo',
		view: 'test',
	}),
);
