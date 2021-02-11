import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {ViewModel} from '../model/view-model';
import {View} from './view';

describe(View.name, () => {
	it('should get document', () => {
		const doc = TestUtil.createWindow().document;
		const v = new View(doc, {
			model: new ViewModel(),
		});
		assert.strictEqual(v.document, doc);
	});
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const m = new ViewModel();
		const v = new View(doc, {
			model: m,
		});
		assert.strictEqual(m.disposed, false);
		m.dispose();
		assert.strictEqual(m.disposed, true);
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
