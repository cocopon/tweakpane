// @flow

import {assert} from 'chai';
import {describe, it} from 'mocha';

import Target from '../model/target';
import * as Preset from './preset';

describe('Preset', () => {
	it('should export JSON', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};

		const preset = Preset.exportJson([
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
		const preset = Preset.exportJson(targets);
		preset.foo = 123;
		preset.bar = 'world';

		Preset.importJson(targets, preset);

		assert.strictEqual(PARAMS.foo, 123);
		assert.strictEqual(PARAMS.bar, 'world');
	});
});
