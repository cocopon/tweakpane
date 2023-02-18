import {
	BindingValue,
	isBindingValue,
} from '../../../common/binding/value/binding';
import {ValueController} from '../../../common/controller/value';
import {BladeController} from '../../common/controller/blade';
import {isValueBladeController} from '../../common/controller/value-blade';
import {LabeledValueController} from '../../label/controller/value-label';

export type BindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
> = LabeledValueController<In, Vc, BindingValue<In>>;

export function isBindingController(
	bc: BladeController,
): bc is BindingController {
	return isValueBladeController(bc) && isBindingValue(bc.value);
}
