import * as assert from 'assert';
import {describe, it} from 'mocha';

import {presetToState, stateToPreset} from './preset';

describe(stateToPreset.name, () => {
	it('should convert state into preset', () => {
		const preset = stateToPreset({
			disabled: false,
			children: [
				{key: 'foo', value: 1, disabled: false},
				{disabled: false},
				{key: 'bar', value: 'text', disabled: false},
				{
					children: [{key: 'baz', value: true, disabled: false}],
				},
			],
		});
		assert.deepStrictEqual(preset, {
			foo: 1,
			bar: 'text',
			baz: true,
		});
	});
});

describe(presetToState.name, () => {
	it('should convert preset into state', () => {
		const state = presetToState(
			{
				disabled: false,
				children: [
					{key: 'foo', value: 0, disabled: false},
					{disabled: false},
					{key: 'bar', value: '', disabled: false},
					{
						children: [{key: 'baz', value: false, disabled: false}],
					},
				],
			},
			{
				foo: 1,
				bar: 'text',
				baz: true,
			},
		);
		assert.deepStrictEqual(state, {
			disabled: false,
			children: [
				{key: 'foo', value: 1, disabled: false},
				{disabled: false},
				{key: 'bar', value: 'text', disabled: false},
				{
					children: [{key: 'baz', value: true, disabled: false}],
				},
			],
		});
	});
});
