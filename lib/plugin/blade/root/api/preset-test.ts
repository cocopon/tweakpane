import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
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

		const targets = [
			new BindingTarget(PARAMS, 'foo'),
			new BindingTarget(PARAMS, 'bar'),
		];
		const preset = exportPresetJson(targets);
		preset.foo = 123;
		preset.bar = 'world';

		importPresetJson(targets, preset);

		assert.strictEqual(PARAMS.foo, 123);
		assert.strictEqual(PARAMS.bar, 'world');
	});
});
