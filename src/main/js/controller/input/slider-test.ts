import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {SliderInputController} from './slider';

describe(SliderInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SliderInputController(doc, {
			disposable: new Disposable(),
			value: new InputValue(0),
		});
		c.disposable.dispose();
		assert.strictEqual(c.disposable.disposed, true);
	});
});
