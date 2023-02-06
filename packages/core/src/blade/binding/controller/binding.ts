import {
	BindingValue,
	isBindingValue,
} from '../../../common/binding/value/binding';
import {ValueController} from '../../../common/controller/value';
import {LabeledValueController} from '../../label/controller/value-label';

export type BindingController<
	In,
	Vc extends ValueController<In> = ValueController<In>,
> = LabeledValueController<In, Vc, BindingValue<In>>;

export function isBindingController(
	c: unknown,
): c is BindingController<unknown> {
	return c instanceof LabeledValueController && isBindingValue(c.value);
}
