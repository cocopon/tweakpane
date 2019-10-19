import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {SeparatorController} from './separator';

describe(SeparatorController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SeparatorController(doc);
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
