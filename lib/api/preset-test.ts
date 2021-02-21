import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Target} from '../plugin/common/model/target';
import {exportPresetJson, importPresetJson} from './preset';

describe('Preset', () => {
	it('should export JSON', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};

		const preset = exportPresetJson([
			new Target(PARAMS, 'foo'),
			new Target(PARAMS, 'bar'),
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

		const targets = [new Target(PARAMS, 'foo'), new Target(PARAMS, 'bar')];
		const preset = exportPresetJson(targets);
		preset.foo = 123;
		preset.bar = 'world';

		importPresetJson(targets, preset);

		assert.strictEqual(PARAMS.foo, 123);
		assert.strictEqual(PARAMS.bar, 'world');
	});
});
