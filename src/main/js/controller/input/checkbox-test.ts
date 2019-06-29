import {assert} from 'chai';
import {describe, it} from 'mocha';

import TestUtil from '../../misc/test-util';
import InputValue from '../../model/input-value';
import CheckboxController from './checkbox';

describe(CheckboxController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new CheckboxController(doc, {
			value: new InputValue(false),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
