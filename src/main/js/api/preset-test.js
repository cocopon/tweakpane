// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import Target from '../model/target';
import * as Preset from './preset';

describe('Preset', () => {
	it('should export JSON', () => {
		const PARAMS = {
			foo: 1,
			bar: 'hello',
		};

		const preset = Preset.exportJson([
			new Target(PARAMS, 'foo'),
			new Target(PARAMS, 'bar'),
		]);
		assert.deepEqual(preset, {
			foo: 1,
			bar: 'hello',
		});
	});

	it('should import JSON', () => {
		const PARAMS = {
			foo: 1,
			bar: 'hello',
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
