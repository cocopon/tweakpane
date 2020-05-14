import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {SvPaletteInputController} from './sv-palette';

describe(SvPaletteInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SvPaletteInputController(doc, {
			disposable: new Disposable(),
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.disposable.dispose();
		assert.strictEqual(c.disposable.disposed, true);
	});
});
