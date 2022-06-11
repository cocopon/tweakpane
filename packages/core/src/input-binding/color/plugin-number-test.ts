import * as assert from 'assert';
import {describe} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {NumberColorInputPlugin} from './plugin-number';

describe('NumberColorInputPlugin', () => {
	[
		{
			view: 'color',
		},
		{
			color: {},
		},
		{
			color: {type: 'float'},
		},
	].forEach((params) => {
		context(`when params=${JSON.stringify(params)}`, () => {
			const input = {
				color: 0x00000000,
			};
			const result = NumberColorInputPlugin.accept(input.color, params);

			it('should accept params', () => {
				assert.ok(result !== null);
			});
		});
	});

	[
		{
			params: {
				view: 'color',
			},
			expected: 1,
		},
		{
			params: {
				alpha: true,
				view: 'color',
			},
			expected: 0,
		},
		{
			params: {
				color: {
					alpha: true,
				},
			},
			expected: 0,
		},
	].forEach(({params, expected}) => {
		context(`when params=${JSON.stringify(params)}`, () => {
			const input = {
				color: 0xffffff00,
			};
			const result = NumberColorInputPlugin.accept(input.color, params);
			if (!result) {
				throw new Error('unexpected result');
			}
			const reader = NumberColorInputPlugin.binding.reader({
				initialValue: input.color,
				params: result.params,
				target: new BindingTarget(input, 'color'),
			});

			it('should apply alpha', () => {
				const c = reader(input.color);
				assert.strictEqual(c.getComponents('rgb', 'int')[3], expected);
			});
		});
	});
});
