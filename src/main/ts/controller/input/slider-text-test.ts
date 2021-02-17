import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter} from '../../formatter/number';
import {TestUtil} from '../../misc/test-util';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {SliderTextInputController} from './slider-text';

describe(SliderTextInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderTextInputController(doc, {
			baseStep: 1,
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: new InputValue(0),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
