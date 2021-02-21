import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {forceCast} from '../misc/type-util';
import {Constraint} from '../plugin/common/constraint/constraint';
import {StepConstraint} from '../plugin/common/constraint/step';
import {ConstraintUtil} from '../plugin/common/constraint/util';
import {Value} from '../plugin/common/model/value';
import {ListController} from '../plugin/input-bindings/common/controller/list';
import {TextController} from '../plugin/input-bindings/common/controller/text';
import {SliderTextController} from '../plugin/input-bindings/number/controller/slider-text';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: TextController,
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
		assert.instanceOf(iv, Value);

		if (!(iv instanceof Value)) {
			throw new Error('Input value is empty');
		}
		const c: Constraint<unknown> | null = forceCast(iv.constraint);
		if (!c) {
			throw new Error('Constraint is empty');
		}

		assert.isNotNull(ConstraintUtil.findConstraint(c, StepConstraint));
	});
});
