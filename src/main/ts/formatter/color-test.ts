import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Color} from '../model/color';
import {ColorFormatter} from './color';

describe(ColorFormatter.name, () => {
	it('should format color with specified stringifier', () => {
		const stringifier = (color: Color): string => {
			return String(color);
		};
		const f = new ColorFormatter(stringifier);

		const c = new Color([0, 127, 255], 'rgb');
		assert.strictEqual(f.format(c), stringifier(c));
	});
});
