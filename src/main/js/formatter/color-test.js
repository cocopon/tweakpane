// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import ColorFormatter from './color';

describe(ColorFormatter.name, () => {
	it('should format color', () => {
		const f = new ColorFormatter();
		assert.strictEqual(
			f.format({r: 0, g: 0x77, b: 0xff}),
			'#0077ff',
		);
	});
});
