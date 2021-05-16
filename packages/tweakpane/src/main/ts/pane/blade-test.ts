import * as assert from 'assert';

import {createTestWindow} from '../misc/test-util';
import {Pane} from './pane';

describe(Pane.name, () => {
	it('should apply initial view properties', () => {
		const doc = createTestWindow().document;
		const pane = new Pane({
			document: doc,
		});

		const i1 = pane.addBlade({
			title: '',
			view: 'button',
		});
		assert.strictEqual(i1.disabled, false);
		assert.strictEqual(i1.hidden, false);

		const i2 = pane.addBlade({
			disabled: true,
			hidden: true,
			title: '',
			view: 'button',
		});
		assert.strictEqual(i2.disabled, true);
		assert.strictEqual(i2.hidden, true);
	});
});
