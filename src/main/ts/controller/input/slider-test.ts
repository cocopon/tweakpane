import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {SliderController} from './slider';

describe(SliderController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderController(doc, {
			baseStep: 1,
			value: new Value(0),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
