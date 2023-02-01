import {BindingValue} from '../../../common/binding/value/value';
import {ValueController} from '../../../common/controller/value';
import {LabeledValueController} from '../../label/controller/value-label';

export type InputBindingController<In> = LabeledValueController<
	In,
	ValueController<In>,
	BindingValue<In>
>;

export function isInputBindingController<In>(
	c: unknown,
): c is InputBindingController<In> {
	if (!(c instanceof LabeledValueController)) {
		return false;
	}
	if (!(c.value instanceof BindingValue)) {
		return false;
	}
	return true;
}
