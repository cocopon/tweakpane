import * as assert from 'assert';
import {describe, it} from 'mocha';

import {exportBladeState, importBladeState} from './blade-state.js';

describe(importBladeState.name, () => {
	it('should pass state to super', (done) => {
		const state = {
			disabled: false,
			hidden: true,
		};

		importBladeState(
			state,
			(s) => {
				assert.strictEqual(s, state);
				done();
				return true;
			},
			(p) => ({
				disabled: p.required.boolean,
				hidden: p.required.boolean,
			}),
			() => true,
		);
	});

	it('should not call callback if super.import() fails', () => {
		const state = {
			disabled: false,
			hidden: true,
		};

		assert.doesNotThrow(() => {
			assert.strictEqual(
				importBladeState(
					state,
					() => false,
					(p) => ({
						disabled: p.required.boolean,
						hidden: p.required.boolean,
					}),
					() => {
						throw new Error('should not be called');
					},
				),
				false,
			);
		});
	});

	it('should parse state', () => {
		const state = {
			disabled: false,
			hidden: true,
		};

		assert.strictEqual(
			importBladeState(
				state,
				() => true,
				(p) => ({
					disabled: p.required.boolean,
					hidden: p.required.boolean,
				}),
				(result) => {
					assert.strictEqual(result.disabled, false);
					assert.strictEqual(result.hidden, true);
					return true;
				},
			),
			true,
		);
	});

	it('should return false if importing failed', () => {
		const state = {
			disabled: false,
			hidden: true,
		};

		assert.strictEqual(
			importBladeState(
				state,
				() => true,
				(p) => ({
					disabled: p.required.boolean,
					hidden: p.required.boolean,
				}),
				() => false,
			),
			false,
		);
	});

	it('should skip super.import() for null', () => {
		const state = {
			disabled: false,
			hidden: true,
		};

		assert.strictEqual(
			importBladeState(
				state,
				null,
				(p) => ({
					disabled: p.required.boolean,
					hidden: p.required.boolean,
				}),
				(result) => {
					assert.strictEqual(result.disabled, false);
					assert.strictEqual(result.hidden, true);
					return true;
				},
			),
			true,
		);
	});
});

describe(exportBladeState.name, () => {
	it('should merge states', () => {
		const state = exportBladeState(
			() => {
				return {foo: 1};
			},
			{bar: 2},
		);

		assert.deepStrictEqual(state, {
			foo: 1,
			bar: 2,
		});
	});

	it('should skip super.export() for null', () => {
		const state = exportBladeState(null, {foo: 123});

		assert.deepStrictEqual(state, {
			foo: 123,
		});
	});

	it('should merge nested states', () => {
		const state = exportBladeState(
			() => ({
				foo: {
					bar: 1,
				},
			}),
			{
				foo: {
					baz: 2,
				},
			},
		);

		assert.deepStrictEqual(state, {
			foo: {
				bar: 1,
				baz: 2,
			},
		});
	});
});
