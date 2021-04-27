import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {deepEqualsArray} from '../../../misc/type-util';
import {BladePosition} from './blade-positions';

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
