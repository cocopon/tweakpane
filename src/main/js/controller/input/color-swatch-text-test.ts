import {assert} from 'chai';
import {describe, it} from 'mocha';

import ColorFormatter from '../../formatter/color';
import TestUtil from '../../misc/test-util';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import StringColorParser from '../../parser/string-color';
import ColorSwatchTextController from './color-swatch-text';

describe(ColorSwatchTextController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorSwatchTextController(doc, {
			formatter: new ColorFormatter(),
			parser: StringColorParser,
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
