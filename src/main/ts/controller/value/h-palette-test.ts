import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Color} from '../../model/color';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {HPaletteController} from './h-palette';

describe(HPaletteController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new HPaletteController(doc, {
			value: new Value(new Color([0, 0, 0], 'rgb')),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
