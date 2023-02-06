import {TpError} from '@tweakpane/core';
import * as assert from 'assert';

import {SliderBladeApi} from '../blade/slider/api/slider';
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

	it('should throw `alreadydisposed` error when calling dispose() inside blade change event', (done) => {
		const doc = createTestWindow().document;
		const pane = new Pane({
			document: doc,
		});
		const b = pane.addBlade({
			max: 100,
			min: 0,
			view: 'slider',
		}) as SliderBladeApi;

		try {
			b.on('change', () => {
				b.dispose();
			});
			b.controller_.value.rawValue = 1;
		} catch (err) {
			assert.strictEqual((err as TpError<any>).type, 'alreadydisposed');
			done();
		}
	});
});
