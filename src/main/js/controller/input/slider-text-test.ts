import {assert} from 'chai';
import {describe, it} from 'mocha';

import NumberFormatter from '../../formatter/number';
import TestUtil from '../../misc/test-util';
import InputValue from '../../model/input-value';
import NumberParser from '../../parser/number';
import SliderTextController from './slider-text';

describe(SliderTextController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderTextController(doc, {
			formatter: new NumberFormatter(2),
			parser: NumberParser,
			value: new InputValue(0),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
