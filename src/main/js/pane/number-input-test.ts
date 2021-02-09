import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {Constraint} from '../constraint/constraint';
import {StepConstraint} from '../constraint/step';
import {ConstraintUtil} from '../constraint/util';
import {ListInputController} from '../controller/input/list';
import {SliderTextInputController} from '../controller/input/slider-text';
import {TextInputController} from '../controller/input/text';
import {TestUtil} from '../misc/test-util';
import {TypeUtil} from '../misc/type-util';
import {InputValue} from '../model/input-value';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(PlainTweakpane.name, () => {
	[
		{
			expectedClass: TextInputController,
			params: {},
			value: 3.14,
		},
		{
			expectedClass: SliderTextInputController,
			params: {
				min: 0,
			},
			value: 3.14,
		},
		{
			expectedClass: SliderTextInputController,
			params: {
				max: 100,
			},
			value: 3.14,
		},
		{
			expectedClass: ListInputController,
			params: {
				options: {
					bar: 1,
					foo: 0,
				},
			},
			value: 3.14,
		},
		{
			expectedClass: ListInputController,
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
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});

	it('should return appropriate step constraint', () => {
		const pane = createPane();
		const obj = {foo: 1};
		const bapi = pane.addInput(obj, 'foo', {
			step: 1,
		});

		const iv = bapi.controller.controller.value;
		assert.instanceOf(iv, InputValue);

		if (!(iv instanceof InputValue)) {
			throw new Error('Input value is empty');
		}
		const c: Constraint<unknown> | null = TypeUtil.forceCast(iv.constraint);
		if (!c) {
			throw new Error('Constraint is empty');
		}

		assert.isNotNull(ConstraintUtil.findConstraint(c, StepConstraint));
	});
});
