import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {findConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {StepConstraint} from '../../common/constraint/step';
import {BoundValue} from '../../common/model/bound-value';
import {NumberTextController} from '../../common/number/controller/number-text';
import {TestUtil} from '../../misc/test-util';
import {forceCast} from '../../misc/type-util';
import {createController} from '../plugin';
import {NumberInputPlugin} from './plugin';

describe(NumberInputPlugin.id, () => {
	it('should return appropriate step constraint', () => {
		const doc = TestUtil.createWindow().document;
		const c = createController(NumberInputPlugin, {
			document: doc,
			params: {
				step: 1,
			},
			target: new BindingTarget({foo: 1}, 'foo'),
		});

		const v = c?.valueController.value;
		if (!(v instanceof BoundValue)) {
			assert.fail('Input value is empty');
		}
		const constraint: Constraint<unknown> | null = forceCast(v.constraint);
		if (!constraint) {
			assert.fail('Constraint is empty');
		}

		assert.notStrictEqual(findConstraint(constraint, StepConstraint), null);
	});

	it('should use specified formatter', () => {
		const doc = TestUtil.createWindow().document;
		const c = createController(NumberInputPlugin, {
			document: doc,
			params: {
				format: (v) => `foo ${v} bar`,
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
