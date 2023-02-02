import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {LabeledValueController} from '../../label/controller/value-label';

export type InputBindingController<In> = LabeledValueController<
	In,
	ValueController<In>,
	InputBindingValue<In>
>;

export function isInputBindingController<In>(
	c: unknown,
): c is InputBindingController<In> {
	if (!(c instanceof LabeledValueController)) {
		return false;
	}
	if (!(c.value instanceof InputBindingValue)) {
		return false;
	}
	return true;
}
