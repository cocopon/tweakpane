import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {NumberFormatter} from '../../../common/formatter/number';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {StringNumberParser} from '../../../common/parser/string-number';
import {SliderTextController} from './slider-text';

describe(SliderTextController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderTextController(doc, {
			baseStep: 1,
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: new Value(0),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
