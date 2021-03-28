import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BoundValue} from '../../../common/model/bound-value';
import {Color} from './color';
import {PickedColor} from './picked-color';

describe(PickedColor.name, () => {
	it('should emit change event', (done) => {
		const pc = new PickedColor(new BoundValue(new Color([0, 0, 0], 'rgb')));
		pc.emitter.on('change', () => {
			assert.strictEqual(pc.mode, 'hsl');
			done();
		});
		pc.mode = 'hsl';
	});

	it('should not emit change event', () => {
		const pc = new PickedColor(new BoundValue(new Color([0, 0, 0], 'rgb')));
		pc.emitter.on('change', () => {
			assert.fail('should not be called');
		});
		pc.mode = 'rgb';
	});
});
