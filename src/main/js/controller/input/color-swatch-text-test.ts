import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as ColorConverter from '../../converter/color';
import {ColorFormatter} from '../../formatter/color';
import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import * as StringColorParser from '../../parser/string-color';
import {ColorSwatchTextInputController} from './color-swatch-text';

describe(ColorSwatchTextInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorSwatchTextInputController(doc, {
			disposable: new Disposable(),
			formatter: new ColorFormatter(ColorConverter.toHexRgbString),
			parser: StringColorParser.CompositeParser,
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.disposable.dispose();
		assert.strictEqual(c.disposable.disposed, true);
	});
});
