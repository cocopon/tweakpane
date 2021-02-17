import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import * as StringColorParser from '../../parser/string-color';
import {ColorSwatchTextController} from './color-swatch-text';

describe(ColorSwatchTextController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorSwatchTextController(doc, {
			formatter: new ColorFormatter(ColorConverter.toHexRgbString),
			parser: StringColorParser.CompositeParser,
			supportsAlpha: false,
			value: new Value(new Color([0, 0, 0], 'rgb')),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
