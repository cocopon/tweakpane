import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {View} from './view';

describe(View.name, () => {
	it('should get document', () => {
		const doc = TestUtil.createWindow().document;
		const v = new View(doc, {
			disposable: new Disposable(),
		});
		assert.strictEqual(v.document, doc);
	});
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const d = new Disposable();
		const v = new View(doc, {
			disposable: d,
		});
		assert.strictEqual(d.disposed, false);
		d.dispose();
		assert.strictEqual(d.disposed, true);
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.document;
		}, PaneError);
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.element;
		}, PaneError);
	});
});
