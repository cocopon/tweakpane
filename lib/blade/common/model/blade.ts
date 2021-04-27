import {BoundValue} from '../../../common/model/bound-value';
import {ValueMap} from '../../../common/model/value-map';
import {deepEqualsArray} from '../../../misc/type-util';
import {BladePosition} from './blade-positions';

export type Blade = ValueMap<{
	positions: BladePosition[];
}>;

export function createBlade(): Blade {
	return new ValueMap({
		positions: new BoundValue<BladePosition[]>([], {
			equals: deepEqualsArray,
		}),
	});
}
