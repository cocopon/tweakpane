import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {SvPaletteController} from './sv-palette';

describe(SvPaletteController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SvPaletteController(doc, {
			viewModel: new ViewModel(),
			value: new Value(new Color([0, 0, 0], 'rgb')),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
