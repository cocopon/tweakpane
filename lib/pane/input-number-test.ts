import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {forceCast} from '../misc/type-util';
import {findConstraint} from '../plugin/common/constraint/composite';
import {Constraint} from '../plugin/common/constraint/constraint';
import {StepConstraint} from '../plugin/common/constraint/step';
import {Value} from '../plugin/common/model/value';
import {ListController} from '../plugin/input-bindings/common/controller/list';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {SliderTextController} from '../plugin/input-bindings/number/controller/slider-text';

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

		assert.isNotNull(findConstraint(c, StepConstraint));
	});

	it('should use specified formatter', () => {
		const pane = createPane();
		const obj = {foo: 123};
		const bapi = pane.addInput(obj, 'foo', {
			format: (v) => `foo ${v} bar`,
		});

		const c = bapi.controller.controller;
		if (!(c instanceof NumberTextController)) {
			throw new Error('unexpected controller');
		}

		assert.strictEqual(c.view.inputElement.value, 'foo 123 bar');
	});
});
