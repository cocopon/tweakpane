import * as assert from 'assert';
import {describe as context, describe} from 'mocha';

import {BindingTarget} from '../../common/binding/target.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {TestUtil} from '../../misc/test-util.js';
import {createInputBindingController} from '../plugin.js';
import {ColorController} from './controller/color.js';
import {IntColor} from './model/int-color.js';
import {ObjectColorInputPlugin} from './plugin-object.js';

const DELTA = 1e-5;

describe(ObjectColorInputPlugin.id, () => {
	[
		{
			params: {},
			expected: {r: 1, g: 0, b: 0, a: 0.5},
		},
		{
			params: {
				color: {type: 'int'},
			},
			expected: {r: 1, g: 0, b: 0, a: 0.5},
		},
		{
			params: {
				color: {type: 'float'},
			},
			expected: {r: 255, g: 0, b: 0, a: 0.5},
		},
	].forEach(({params, expected}) => {
		context(`when params=${JSON.stringify(params)}`, () => {
			const input = {
				color: {r: 0, g: 0, b: 0, a: 0},
			};
			const result = ObjectColorInputPlugin.accept(input.color, params);
			if (!result) {
				throw new Error('unexpected result');
			}
			const target = new BindingTarget(input, 'color');
			const reader = ObjectColorInputPlugin.binding.reader({
				initialValue: input.color,
				params: result.params,
				target: target,
			});

			it('should apply color type to binding reader', () => {
				const c = reader({r: 1, g: 0, b: 0, a: 0.5});
				const comps = c.getComponents('rgb');

				assert.ok(TestUtil.closeTo(comps[0], expected.r, DELTA), 'r');
				assert.ok(TestUtil.closeTo(comps[1], expected.g, DELTA), 'g');
				assert.ok(TestUtil.closeTo(comps[2], expected.b, DELTA), 'b');
				assert.ok(TestUtil.closeTo(comps[3], expected.a, DELTA), 'a');
			});
		});
	});

	[
		{
			input: {
				params: {},
			},
			expected: {r: 255, g: 0, b: 0, a: 1},
		},
		{
			input: {
				params: {
					color: {type: 'int'},
				},
			},
			expected: {r: 255, g: 0, b: 0, a: 1},
		},
		{
			input: {
				params: {
					color: {type: 'float'},
				},
			},
			expected: {r: 1, g: 0, b: 0, a: 1},
		},
	].forEach(({input, expected}) => {
		context(`when params=${JSON.stringify(input)}`, () => {
			const p = {
				color: {r: 0, g: 0, b: 0, a: 0},
			};
			const result = ObjectColorInputPlugin.accept(p.color, input.params);
			if (!result) {
				throw new Error('unexpected result');
			}
			const target = new BindingTarget(p, 'color');
			const writer = ObjectColorInputPlugin.binding.writer({
				initialValue: p.color,
				params: result.params,
				target: target,
			});
			writer(target, new IntColor([255, 0, 0, 1], 'rgb'));

			it('should apply color type to binding writer', () => {
				assert.deepStrictEqual(target.read(), expected);
			});
		});
	});

	[
		{
			params: {
				initialValue: {r: 0, g: 0, b: 0, a: 1},
				inputParams: {},
			},
			expected: '{r: 0, g: 0, b: 0, a: 1.00}',
		},
		{
			params: {
				initialValue: {r: 0.1, g: 0.2, b: 0.3, a: 1},
				inputParams: {
					color: {
						type: 'float',
					},
				},
			},
			expected: '{r: 0.10, g: 0.20, b: 0.30, a: 1.00}',
		},
	].forEach(({params, expected}) => {
		context(`when params=${JSON.stringify(params)}`, () => {
			const bc = createInputBindingController(ObjectColorInputPlugin, {
				document: createTestWindow().document,
				params: params.inputParams,
				target: new BindingTarget(params, 'initialValue'),
			});
			const c = bc?.valueController as ColorController;

			it('should have initial input value', () => {
				assert.strictEqual(c.textController.view.inputElement.value, expected);
			});
		});
	});

	[
		{
			params: {
				inputParams: {},
				inputText: 'rgba(0, 127, 255, 1)',
			},
			expected: '{r: 0, g: 127, b: 255, a: 1.00}',
		},
		{
			params: {
				inputParams: {
					color: {
						type: 'float',
					},
				},
				inputText: 'rgba(0, 127, 255, 1)',
			},
			expected: '{r: 0.00, g: 0.50, b: 1.00, a: 1.00}',
		},
	].forEach(({params, expected}) => {
		context(`when params=${JSON.stringify(params)}`, () => {
			const win = createTestWindow();
			const bc = createInputBindingController(ObjectColorInputPlugin, {
				document: win.document,
				params: params.inputParams,
				target: new BindingTarget(
					{
						color: {r: 0, g: 0, b: 0, a: 0},
					},
					'color',
				),
			});
			const c = bc?.valueController as ColorController;

			c.textController.view.inputElement.value = params.inputText;
			c.textController.view.inputElement.dispatchEvent(
				TestUtil.createEvent(win, 'change'),
			);

			it('should apply input text', () => {
				assert.strictEqual(c.textController.view.inputElement.value, expected);
			});
		});
	});
});
