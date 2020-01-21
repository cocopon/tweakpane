import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ColorFormatter} from '../../formatter/color';
import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import * as StringColorParser from '../../parser/string-color';
import {ColorSwatchTextInputController} from './color-swatch-text';

describe(ColorSwatchTextInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorSwatchTextInputController(doc, {
			formatter: new ColorFormatter(),
			parser: StringColorParser.CompositeParser,
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
