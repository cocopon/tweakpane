import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {ColorSwatchTextInputController} from './color-swatch-text';

describe(ColorSwatchTextInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorSwatchTextInputController(doc, {
			formatter: new ColorFormatter(ColorConverter.toHexRgbString),
			parser: StringColorParser.CompositeParser,
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
