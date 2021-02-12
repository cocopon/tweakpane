import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {SvPaletteInputController} from './sv-palette';

describe(SvPaletteInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SvPaletteInputController(doc, {
			viewModel: new ViewModel(),
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
