import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {View} from './view';

describe(View.name, () => {
	it('should get document', () => {
		const doc = TestUtil.createWindow().document;
		const v = new View(doc);
		assert.strictEqual(v.document, doc);
	});
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const v = new View(doc);
		assert.strictEqual(v.disposed, false);
		v.dispose();
		assert.strictEqual(v.disposed, true);
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
