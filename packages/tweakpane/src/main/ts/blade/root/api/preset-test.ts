import {Binding, BindingTarget} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {exportPresetJson, importPresetJson} from './preset';

describe('Preset', () => {
	it('should export JSON', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};

		const preset = exportPresetJson([
			{
				target: new BindingTarget(PARAMS, 'foo'),
				presetKey: 'foo',
			},
			{
				target: new BindingTarget(PARAMS, 'bar'),
				presetKey: 'bar',
			},
		] as Binding[]);
		assert.deepStrictEqual(preset, {
			bar: 'hello',
			foo: 1,
		});
	});

	it('should import JSON', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};

		const bindings: Binding[] = [
			{
				target: new BindingTarget(PARAMS, 'foo'),
				presetKey: 'foo',
			},
			{
				target: new BindingTarget(PARAMS, 'bar'),
				presetKey: 'bar',
			},
		];
		const preset = exportPresetJson(bindings);
		preset.foo = 123;
		preset.bar = 'world';

		importPresetJson(bindings, preset);

		assert.strictEqual(PARAMS.foo, 123);
		assert.strictEqual(PARAMS.bar, 'world');
	});
});
