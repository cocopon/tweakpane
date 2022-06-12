import * as assert from 'assert';
import {describe as context, describe} from 'mocha';

import {BindingTarget} from '../../index';
import {createTestWindow} from '../../misc/dom-test-util';
import {TestUtil} from '../../misc/test-util';
import {createInputBindingController} from '../plugin';
import {ColorController} from './controller/color';
import {Color} from './model/color';
import {ObjectColorInputPlugin} from './plugin-object';

describe(ObjectColorInputPlugin.id, () => {
	[
		{
			params: {},
			expected: 'int',
		},
		{
			params: {
				color: {type: 'int'},
			},
			expected: 'int',
		},
		{
			params: {
				color: {type: 'float'},
			},
			expected: 'float',
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
			const reader = ObjectColorInputPlugin.binding.reader({
				initialValue: input.color,
				params: result.params,
				target: new BindingTarget(input, 'color'),
			});

			it('should apply color type to binding reader', () => {
				assert.strictEqual(reader(input.color).type, expected);
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
			writer(target, new Color([255, 0, 0, 1], 'rgb', 'int'));

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
				inputText: 'rgba(0.1, 0.2, 0.3, 1)',
			},
			expected: '{r: 0.10, g: 0.20, b: 0.30, a: 1.00}',
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
