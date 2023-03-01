import {
	BindingTarget,
	createValue,
	InputBinding,
	numberFromUnknown,
	stringFromUnknown,
	writePrimitive,
} from '@tweakpane/core';
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
			new BindingTarget(PARAMS, 'foo'),
			new BindingTarget(PARAMS, 'bar'),
		]);
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

		const bindings = [
			new InputBinding({
				reader: numberFromUnknown,
				target: new BindingTarget(PARAMS, 'foo'),
				value: createValue(PARAMS.foo),
				writer: writePrimitive,
			}) as InputBinding<unknown>,
			new InputBinding({
				reader: stringFromUnknown,
				target: new BindingTarget(PARAMS, 'bar'),
				value: createValue(PARAMS.bar),
				writer: writePrimitive,
			}) as InputBinding<unknown>,
		];
		const preset = exportPresetJson(bindings.map((b) => b.target));
		preset.foo = 123;
		preset.bar = 'world';

		importPresetJson(bindings, preset);

		assert.strictEqual(PARAMS.foo, 123);
		assert.strictEqual(PARAMS.bar, 'world');
	});
});
