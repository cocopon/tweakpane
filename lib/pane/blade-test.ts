import * as assert from 'assert';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';

describe(Tweakpane.name, () => {
	it('should apply initial view properties', () => {
		const doc = TestUtil.createWindow().document;
		const pane = new Tweakpane({
			document: doc,
		});

		const i1 = pane.addBlade_v3_({
			title: '',
			view: 'button',
		});
		assert.strictEqual(i1.disabled, false);
		assert.strictEqual(i1.hidden, false);

		const i2 = pane.addBlade_v3_({
			disabled: true,
			hidden: true,
			title: '',
			view: 'button',
		});
		assert.strictEqual(i2.disabled, true);
		assert.strictEqual(i2.hidden, true);
	});
});
