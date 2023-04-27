import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {deepEqualsArray} from '../../../misc/type-util.js';
import {BladePosition} from './blade-positions.js';

export type Blade = ValueMap<{
	positions: BladePosition[];
}>;

export function createBlade(): Blade {
	return new ValueMap({
		positions: createValue<BladePosition[]>([], {
			equals: deepEqualsArray,
		}),
	});
}
