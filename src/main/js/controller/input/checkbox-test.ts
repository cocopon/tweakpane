import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {InputValue} from '../../model/input-value';
import {CheckboxInputController} from './checkbox';

describe(CheckboxInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new CheckboxInputController(doc, {
			value: new InputValue(false),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
