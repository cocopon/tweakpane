import {assert} from 'chai';
import {describe, it} from 'mocha';

import TestUtil from '../../misc/test-util';
import InputValue from '../../model/input-value';
import SliderController from './slider';

describe(SliderController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderController(doc, {
			value: new InputValue(0),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
