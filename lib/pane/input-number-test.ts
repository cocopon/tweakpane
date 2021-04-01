import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {findConstraint} from '../common/constraint/composite';
import {Constraint} from '../common/constraint/constraint';
import {StepConstraint} from '../common/constraint/step';
import {BoundValue} from '../common/model/bound-value';
import Tweakpane from '../index';
import {ListController} from '../input-binding/common/controller/list';
import {NumberTextController} from '../input-binding/number/controller/number-text';
import {SliderTextController} from '../input-binding/number/controller/slider-text';
import {TestUtil} from '../misc/test-util';
import {forceCast} from '../misc/type-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: NumberTextController,
			params: {},
			value: 3.14,
		},
		{
			expectedClass: SliderTextController,
			params: {
				min: 0,
			},
			value: 3.14,
		},
		{
			expectedClass: SliderTextController,
			params: {
				max: 100,
			},
			value: 3.14,
		},
		{
			expectedClass: ListController,
			params: {
				options: {
					bar: 1,
					foo: 0,
				},
			},
			value: 3.14,
		},
		{
			expectedClass: ListController,
			params: {
				options: [
					{text: 'foo', value: 0},
					{text: 'bar', value: 1},
				],
			},
			value: 3.14,
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.strictEqual(
					bapi.controller_.valueController instanceof testCase.expectedClass,
					true,
				);
			});
		});
	});

	it('should return appropriate step constraint', () => {
		const pane = createPane();
		const obj = {foo: 1};
		const bapi = pane.addInput(obj, 'foo', {
			step: 1,
		});

		const iv = bapi.controller_.valueController.value;
		if (!(iv instanceof BoundValue)) {
			assert.fail('Input value is empty');
		}
		const c: Constraint<unknown> | null = forceCast(iv.constraint);
		if (!c) {
			assert.fail('Constraint is empty');
		}

		assert.notStrictEqual(findConstraint(c, StepConstraint), null);
	});

	it('should use specified formatter', () => {
		const pane = createPane();
		const obj = {foo: 123};
		const bapi = pane.addInput(obj, 'foo', {
			format: (v) => `foo ${v} bar`,
		});

		const c = bapi.controller_.valueController;
		if (!(c instanceof NumberTextController)) {
			assert.fail('unexpected controller');
		}

		assert.strictEqual(c.view.inputElement.value, 'foo 123 bar');
	});
});
