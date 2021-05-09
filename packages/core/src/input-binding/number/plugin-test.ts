import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {findConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {StepConstraint} from '../../common/constraint/step';
import {BoundValue} from '../../common/model/bound-value';
import {NumberTextController} from '../../common/number/controller/number-text';
import {createTestWindow} from '../../misc/dom-test-util';
import {createInputBindingController} from '../plugin';
import {NumberInputPlugin} from './plugin';

describe(NumberInputPlugin.id, () => {
	it('should return appropriate step constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(NumberInputPlugin, {
			document: doc,
			params: {
				step: 1,
			},
			target: new BindingTarget({foo: 1}, 'foo'),
		});

		const v = c?.binding.value as BoundValue<number>;
		assert.strictEqual(
			findConstraint(v.constraint as Constraint<number>, StepConstraint)?.step,
			1,
		);
	});

	it('should use specified formatter', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(NumberInputPlugin, {
			document: doc,
			params: {
				format: (v: number) => `foo ${v} bar`,
			},
			target: new BindingTarget({foo: 123}, 'foo'),
		});

		const vc = c?.valueController as NumberTextController;
		if (!(vc instanceof NumberTextController)) {
			assert.fail('unexpected controller');
		}

		assert.strictEqual(vc.view.inputElement.value, 'foo 123 bar');
	});
});
